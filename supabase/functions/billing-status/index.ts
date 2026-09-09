import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type BillingStatusRow = {
  email: string;
  premium_active: boolean;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  current_period_end: string | null;
};

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

const normalizeEmail = (value: unknown): string | null => {
  if (typeof value !== 'string') {
    return null;
  }
  const email = value.trim().toLowerCase();
  return email.includes('@') ? email : null;
};

const emptyStatus = (email: string): BillingStatusRow => ({
  email,
  premium_active: false,
  stripe_customer_id: null,
  stripe_subscription_id: null,
  current_period_end: null,
});

function serviceClient() {
  return createClient(requiredEnv('SUPABASE_URL').replace(/\/$/, ''), requiredEnv('SUPABASE_SERVICE_ROLE_KEY'), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function emailFromJwt(request: Request): Promise<string | null> {
  const header = request.headers.get('Authorization') || '';
  const token = header.replace(/^Bearer\s+/i, '').trim();
  if (!token) {
    return null;
  }

  try {
    const supabase = createClient(requiredEnv('SUPABASE_URL').replace(/\/$/, ''), requiredEnv('SUPABASE_SERVICE_ROLE_KEY'), {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await supabase.auth.getUser(token);
    if (error) {
      return null;
    }
    return normalizeEmail(data.user?.email);
  } catch {
    return null;
  }
}

async function emailFromRequest(request: Request): Promise<string | null> {
  const url = new URL(request.url);
  const fromQuery = normalizeEmail(url.searchParams.get('email'));
  if (fromQuery) {
    return fromQuery;
  }

  try {
    const body = await request.json();
    return normalizeEmail((body as { email?: unknown })?.email);
  } catch {
    return null;
  }
}

async function getBillingStatus(email: string): Promise<BillingStatusRow> {
  const supabase = serviceClient();
  const { data, error } = await supabase
    .from('billing_statuses')
    .select('email, premium_active, stripe_customer_id, stripe_subscription_id, current_period_end')
    .eq('email', email)
    .maybeSingle();

  if (error) {
    throw new Error(`Supabase lookup failed: ${error.message}`);
  }

  if (!data) {
    return emptyStatus(email);
  }

  return {
    email,
    premium_active: data.premium_active === true,
    stripe_customer_id: typeof data.stripe_customer_id === 'string' ? data.stripe_customer_id : null,
    stripe_subscription_id: typeof data.stripe_subscription_id === 'string' ? data.stripe_subscription_id : null,
    current_period_end: typeof data.current_period_end === 'string' ? data.current_period_end : null,
  };
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (request.method !== 'GET' && request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  try {
    const jwtEmail = await emailFromJwt(request);
    const requestedEmail = await emailFromRequest(request);
    const email = jwtEmail || requestedEmail;
    if (!email) {
      return jsonResponse({ error: 'Email is required' }, 400);
    }

    const status = await getBillingStatus(email);
    return jsonResponse({
      email: status.email,
      premium_active: Boolean(status.premium_active),
      stripe_customer_id: status.stripe_customer_id,
      stripe_subscription_id: status.stripe_subscription_id,
      current_period_end: status.current_period_end,
    });
  } catch (error) {
    console.error('billing-status failed', error);
    return jsonResponse(
      { error: error instanceof Error ? error.message : 'Failed to fetch billing status' },
      400,
    );
  }
});
