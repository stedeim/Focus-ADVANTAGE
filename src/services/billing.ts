export type BillingStatusResponse = {
  email: string;
  premium_active: boolean;
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
  current_period_end?: string | null;
};

const getSupabaseBaseUrl = () => import.meta.env.VITE_SUPABASE_URL?.trim().replace(/\/$/, '');

export async function fetchBillingStatus(email: string): Promise<boolean | null> {
  const baseUrl = getSupabaseBaseUrl();
  const normalizedEmail = email.trim().toLowerCase();

  if (!baseUrl || !normalizedEmail) {
    return null;
  }

  try {
    const response = await fetch(`${baseUrl}/functions/v1/billing-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
