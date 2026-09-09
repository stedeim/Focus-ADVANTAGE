-- P0-3: billing tables, RLS so clients cannot forge premium, webhook/service-role writes.
-- Matches the live "the focus advantage" schema (ref zsswidmafowdlwymuide).
-- Idempotent: does not drop existing billing data.

create table if not exists public.billing_statuses (
  email text primary key,
  premium_active boolean not null default false,
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  full_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers (id),
  product_type text,
  tier text,
  stripe_subscription_id text,
  status text,
  purchase_date timestamptz default now(),
  next_billing_date timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.stripe_webhook_events (
  id text primary key,
  type text not null,
  processed_at timestamptz not null default now()
);

create index if not exists billing_statuses_stripe_customer_id_idx
  on public.billing_statuses (stripe_customer_id);

create index if not exists billing_statuses_stripe_subscription_id_idx
  on public.billing_statuses (stripe_subscription_id);

create index if not exists billing_statuses_email_lower_idx
  on public.billing_statuses (lower(email));

create index if not exists customers_email_lower_idx
  on public.customers (lower(email));

-- Unique on stripe_subscription_id (NULLs allowed). Needed for PostgREST upserts.
create unique index if not exists subscriptions_stripe_subscription_id_key
  on public.subscriptions (stripe_subscription_id);

create index if not exists profiles_email_lower_idx
  on public.profiles (lower(email));

alter table public.billing_statuses enable row level security;
alter table public.customers enable row level security;
alter table public.subscriptions enable row level security;
alter table public.stripe_webhook_events enable row level security;

-- No policies for anon/authenticated: clients cannot read or write billing rows.
-- Service role (Edge Functions) bypasses RLS.

revoke all on table public.billing_statuses from anon, authenticated, public;
revoke all on table public.customers from anon, authenticated, public;
revoke all on table public.subscriptions from anon, authenticated, public;
revoke all on table public.stripe_webhook_events from anon, authenticated, public;

grant all on table public.billing_statuses to service_role;
grant all on table public.customers to service_role;
grant all on table public.subscriptions to service_role;
grant all on table public.stripe_webhook_events to service_role;

-- Clients may keep their own profile cache, but they cannot flip premium_active.
-- Webhook / billing-status (service_role) and SQL as postgres remain writers.

create or replace function public.protect_profile_premium()
returns trigger
language plpgsql
as $$
begin
  if coalesce(auth.role(), '') = 'service_role'
     or current_user in ('postgres', 'supabase_admin', 'service_role') then
    return new;
  end if;

  if tg_op = 'INSERT' then
    new.premium_active := false;
  elsif tg_op = 'UPDATE' then
    new.premium_active := old.premium_active;
  end if;

  return new;
end;
$$;

drop trigger if exists protect_profile_premium on public.profiles;
create trigger protect_profile_premium
  before insert or update on public.profiles
  for each row
  execute procedure public.protect_profile_premium();
