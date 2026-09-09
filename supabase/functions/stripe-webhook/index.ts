import { createClient, type SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
};

const encoder = new TextEncoder();
const PREMIUM_STATUSES = new Set(['active', 'trialing', 'past_due']);
const HANDLED_EVENTS = new Set([
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.paid',
  'invoice.payment_failed',
]);

type JsonMap = Record<string, unknown>;

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

const requiredEnv = (name: string) => {
  const value = Deno.env.get(name)?.trim();
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
};

const optionalEnv = (name: string) => Deno.env.get(name)?.trim() || '';

const asRecord = (value: unknown): JsonMap | null =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as JsonMap) : null;

const asString = (value: unknown): string | null =>
  typeof value === 'string' && value.trim() ? value.trim() : null;

const asId = (value: unknown): string | null => {
  const direct = asString(value);
  if (direct) {
    return direct;
  }
  const record = asRecord(value);
  return record ? asString(record.id) : null;
};

const normalizeEmail = (value: unknown): string | null => {
  const email = asString(value)?.toLowerCase();
  return email && email.includes('@') ? email : null;
};

const hex = (buffer: ArrayBuffer) =>
  Array.from(new Uint8Array(buffer))
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('');

const timingSafeEqual = (left: string, right: string) => {
  if (left.length !== right.length) {
    return false;
  }
  let mismatch = 0;
  for (let i = 0; i < left.length; i += 1) {
    mismatch |= left.charCodeAt(i) ^ right.charCodeAt(i);
  }
  return mismatch === 0;
};

const unixToIso = (value: unknown): string | null => {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    return null;
  }
  return new Date(value * 1000).toISOString();
};

const periodEndFrom = (object: JsonMap | null): string | null => {
  if (!object) {
    return null;
  }
  const direct = unixToIso(object.current_period_end);
  if (direct) {
    return direct;
  }
  const items = asRecord(object.items);
  const data = Array.isArray(items?.data) ? items.data : [];
  for (const item of data) {
    const row = asRecord(item);
    const end = unixToIso(row?.current_period_end);
    if (end) {
      return end;
    }
  }
  return unixToIso(object.period_end);
};

const isPremiumStatus = (status: string | null, deleted = false) => {
  if (deleted) {
    return false;
  }
  return Boolean(status && PREMIUM_STATUSES.has(status));
};

async function verifyStripeSignature(rawBody: string, signatureHeader: string | null) {
  const webhookSecret = requiredEnv('STRIPE_WEBHOOK_SECRET');
  if (!signatureHeader) {
    return false;
  }

  const parts = signatureHeader.split(',').map((part) => part.trim());
  const timestamp = parts.find((part) => part.startsWith('t='))?.slice(2);
  const signatures = parts.filter((part) => part.startsWith('v1=')).map((part) => part.slice(3).toLowerCase());
  if (!timestamp || signatures.length === 0) {
    return false;
  }

  const ageSeconds = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(ageSeconds) || ageSeconds > 300) {
    return false;
  }

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(webhookSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const digest = await crypto.subtle.sign('HMAC', key, encoder.encode(`${timestamp}.${rawBody}`));
  const expected = hex(digest);
  return signatures.some((candidate) => timingSafeEqual(expected, candidate));
}

function serviceClient() {
  return createClient(requiredEnv('SUPABASE_URL').replace(/\/$/, ''), requiredEnv('SUPABASE_SERVICE_ROLE_KEY'), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function stripeGet(path: string): Promise<JsonMap | null> {
  const secret = optionalEnv('STRIPE_SECRET_KEY') || optionalEnv('STRIPE_API_KEY');
  if (!secret) {
    return null;
  }

  const response = await fetch(`https://api.stripe.com/v1/${path}`, {
    headers: { Authorization: `Bearer ${secret}` },
  });
  if (!response.ok) {
    console.error(`Stripe GET ${path} failed`, response.status, await response.text());
    return null;
  }
  return asRecord(await response.json());
}

async function alreadyProcessed(supabase: SupabaseClient, eventId: string) {
  const { data, error } = await supabase.from('stripe_webhook_events').select('id').eq('id', eventId).maybeSingle();
  if (error) {
    console.error('stripe_webhook_events lookup failed', error.message);
    return false;
  }
  return Boolean(data?.id);
}

async function recordEvent(supabase: SupabaseClient, eventId: string, type: string) {
  const { error } = await supabase.from('stripe_webhook_events').insert({ id: eventId, type });
  if (error && error.code !== '23505') {
    console.error('stripe_webhook_events insert failed', error.message);
  }
}

async function emailFromStripeCustomer(customerId: string | null) {
  if (!customerId) {
    return null;
  }
  const customer = await stripeGet(`customers/${customerId}`);
  return normalizeEmail(customer?.email);
}

async function loadSubscription(subscriptionId: string | null) {
  if (!subscriptionId) {
    return null;
  }
  return stripeGet(`subscriptions/${subscriptionId}`);
}

async function resolveEmail(
  supabase: SupabaseClient,
  object: JsonMap,
  customerId: string | null,
  subscriptionId: string | null,
) {
  const direct =
    normalizeEmail(asRecord(object.customer_details)?.email) ||
    normalizeEmail(object.customer_email) ||
    normalizeEmail(object.email) ||
    normalizeEmail(asRecord(object.metadata)?.email);

  if (direct) {
    return direct;
  }

  if (customerId) {
    const { data } = await supabase
      .from('billing_statuses')
      .select('email')
      .eq('stripe_customer_id', customerId)
      .limit(1)
      .maybeSingle();
    const cached = normalizeEmail(data?.email);
    if (cached) {
      return cached;
    }
  }

  if (subscriptionId) {
    const { data } = await supabase
      .from('billing_statuses')
      .select('email')
      .eq('stripe_subscription_id', subscriptionId)
      .limit(1)
      .maybeSingle();
    const cached = normalizeEmail(data?.email);
    if (cached) {
      return cached;
    }
  }

  return emailFromStripeCustomer(customerId);
}

async function upsertCustomer(supabase: SupabaseClient, email: string, fullName: string | null) {
  const { data, error } = await supabase
    .from('customers')
    .upsert(
      {
        email,
        ...(fullName ? { full_name: fullName } : {}),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'email' },
    )
    .select('id')
    .maybeSingle();

  if (error) {
    console.error('Failed to upsert customer', error.message);
    return null;
  }

  return asString(data?.id);
}

async function upsertSubscription(
  supabase: SupabaseClient,
  input: {
    customerRowId: string | null;
    stripeSubscriptionId: string | null;
    status: string | null;
    periodEnd: string | null;
  },
) {
  if (!input.stripeSubscriptionId) {
    return;
  }

  const payload: JsonMap = {
    product_type: 'focus_advantage',
    tier: 'premium',
    stripe_subscription_id: input.stripeSubscriptionId,
    status: input.status,
    next_billing_date: input.periodEnd,
    updated_at: new Date().toISOString(),
  };
  if (input.customerRowId) {
    payload.customer_id = input.customerRowId;
  }

  const { error } = await supabase.from('subscriptions').upsert(payload, { onConflict: 'stripe_subscription_id' });
  if (error) {
    console.error('Failed to upsert subscription', error.message);
  }
}

async function upsertBilling(
  supabase: SupabaseClient,
  input: {
    email: string;
    premiumActive: boolean;
    stripeCustomerId: string | null;
    stripeSubscriptionId: string | null;
    periodEnd: string | null;
    fullName: string | null;
    subscriptionStatus: string | null;
  },
) {
  const now = new Date().toISOString();
  const billingPayload: JsonMap = {
    email: input.email,
    premium_active: input.premiumActive,
    updated_at: now,
  };
  if (input.stripeCustomerId) {
    billingPayload.stripe_customer_id = input.stripeCustomerId;
  }
  if (input.stripeSubscriptionId) {
    billingPayload.stripe_subscription_id = input.stripeSubscriptionId;
  }
  if (input.periodEnd) {
    billingPayload.current_period_end = input.periodEnd;
  }

  const { error } = await supabase.from('billing_statuses').upsert(billingPayload, { onConflict: 'email' });

  if (error) {
    throw new Error(`Failed to upsert billing_statuses: ${error.message}`);
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .update({ premium_active: input.premiumActive, updated_at: now })
    .eq('email', input.email);

  if (profileError) {
    console.error('Failed to sync profiles.premium_active', profileError.message);
  }

  const customerRowId = await upsertCustomer(supabase, input.email, input.fullName);
  await upsertSubscription(supabase, {
    customerRowId,
    stripeSubscriptionId: input.stripeSubscriptionId,
    status: input.subscriptionStatus,
    periodEnd: input.periodEnd,
  });
}

async function applyEvent(supabase: SupabaseClient, type: string, object: JsonMap) {
  const customerId = asId(object.customer);
  let subscriptionId =
    asId(object.subscription) ||
    (type.startsWith('customer.subscription') ? asId(object.id) : null);
  let subscription = type.startsWith('customer.subscription') ? object : null;
  let periodEnd = periodEndFrom(object);
  let status = asString(object.status);
  const fullName =
    asString(asRecord(object.customer_details)?.name) ||
    asString(object.name) ||
    null;

  if (!subscription && subscriptionId) {
    subscription = await loadSubscription(subscriptionId);
  }
  if (subscription) {
    subscriptionId = asId(subscription.id) || subscriptionId;
    periodEnd = periodEndFrom(subscription) || periodEnd;
    status = asString(subscription.status) || status;
  }

  const email = await resolveEmail(supabase, object, customerId, subscriptionId);
  if (!email) {
    console.error(`No email for Stripe event ${type}`);
    return;
  }

  let premiumActive = false;
  if (type === 'checkout.session.completed') {
    const paid = asString(object.payment_status) !== 'unpaid';
    premiumActive = paid && (isPremiumStatus(status) || Boolean(subscriptionId) || asString(object.status) === 'complete');
  } else if (type === 'customer.subscription.deleted') {
    premiumActive = false;
    status = status || 'canceled';
  } else if (type === 'invoice.paid') {
    premiumActive = true;
    if (status) {
      premiumActive = isPremiumStatus(status) || status === 'paid';
    }
  } else if (type === 'invoice.payment_failed') {
    premiumActive = isPremiumStatus(status);
  } else {
    premiumActive = isPremiumStatus(status, type === 'customer.subscription.deleted');
  }

  await upsertBilling(supabase, {
    email,
    premiumActive,
    stripeCustomerId: customerId || asId(subscription?.customer) || null,
    stripeSubscriptionId: subscriptionId,
    periodEnd,
    fullName,
    subscriptionStatus: status,
  });
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  const rawBody = await request.text();
  const signature = request.headers.get('stripe-signature');

  try {
    const signatureOk = await verifyStripeSignature(rawBody, signature);
    if (!signatureOk) {
      return jsonResponse({ error: 'Invalid Stripe signature' }, 400);
    }
  } catch (error) {
    return jsonResponse({ error: error instanceof Error ? error.message : 'Signature verification failed' }, 500);
  }

  let event: JsonMap;
  try {
    event = asRecord(JSON.parse(rawBody)) ?? {};
  } catch {
    return jsonResponse({ error: 'Invalid JSON payload' }, 400);
  }

  const type = asString(event.type);
  const eventId = asString(event.id);
  const object = asRecord(event.data) ? asRecord((event.data as JsonMap).object) : asRecord(event.data);
  if (!type || !eventId || !object) {
    return jsonResponse({ error: 'Malformed Stripe event' }, 400);
  }

  try {
    const supabase = serviceClient();
    if (await alreadyProcessed(supabase, eventId)) {
      return jsonResponse({ received: true, duplicate: true });
    }

    if (HANDLED_EVENTS.has(type)) {
      await applyEvent(supabase, type, object);
    }

    await recordEvent(supabase, eventId, type);
    return jsonResponse({ received: true });
  } catch (error) {
    console.error('stripe-webhook failed', error);
    return jsonResponse({ error: error instanceof Error ? error.message : 'Webhook processing failed' }, 400);
  }
});
