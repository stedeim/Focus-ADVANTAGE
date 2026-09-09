import { getSupabaseClient } from '../lib/supabaseClient';

export type BillingStatusResponse = {
  email: string;
  premium_active: boolean;
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
  current_period_end?: string | null;
};

const getSupabaseBaseUrl = () => import.meta.env.VITE_SUPABASE_URL?.trim().replace(/\/$/, '');
const getSupabaseAnonKey = () => import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || '';

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

async function billingHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const anonKey = getSupabaseAnonKey();
  if (anonKey) {
    headers.apikey = anonKey;
    headers.Authorization = `Bearer ${anonKey}`;
  }

  const supabase = getSupabaseClient();
  if (supabase) {
    const { data } = await supabase.auth.getSession();
    const accessToken = data.session?.access_token;
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }
  }

  return headers;
}

export async function fetchBillingStatus(email: string): Promise<boolean | null> {
  const baseUrl = getSupabaseBaseUrl();
  const normalizedEmail = email.trim().toLowerCase();

  if (!baseUrl || !normalizedEmail) {
    return null;
  }

  try {
    const response = await fetch(`${baseUrl}/functions/v1/billing-status`, {
      method: 'POST',
      headers: await billingHeaders(),
      body: JSON.stringify({ email: normalizedEmail }),
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as Partial<BillingStatusResponse> | undefined;
    return Boolean(data?.premium_active);
  } catch {
    return null;
  }
}

export async function pollBillingStatus(
  email: string,
  options: { attempts?: number; delayMs?: number; signal?: { cancelled: boolean } } = {},
): Promise<boolean | null> {
  const attempts = options.attempts ?? 1;
  const delayMs = options.delayMs ?? 1500;
  let last: boolean | null = null;

  for (let i = 0; i < attempts; i += 1) {
    if (options.signal?.cancelled) {
      return null;
    }

    last = await fetchBillingStatus(email);
    if (last === true) {
      return true;
    }

    if (i < attempts - 1) {
      await wait(delayMs);
    }
  }

  return last;
}
