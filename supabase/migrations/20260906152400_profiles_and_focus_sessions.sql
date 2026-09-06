-- P0-2: user profiles + completed focus sessions.
-- Does not drop or alter existing billing tables (billing_statuses, customers,
-- newsletter_signups, subscriptions).

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  name text,
  onboarding jsonb,
  current_mission text,
  last_review text,
  streak integer not null default 0,
  premium_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.focus_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  mission text,
  duration_seconds integer not null,
  completed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists focus_sessions_user_id_idx
  on public.focus_sessions (user_id);

create index if not exists focus_sessions_completed_at_idx
  on public.focus_sessions (user_id, completed_at desc);

alter table public.profiles enable row level security;
alter table public.focus_sessions enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles
  for insert
  with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Users can read own sessions" on public.focus_sessions;
create policy "Users can read own sessions"
  on public.focus_sessions
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own sessions" on public.focus_sessions;
create policy "Users can insert own sessions"
  on public.focus_sessions
  for insert
  with check (auth.uid() = user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute procedure public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(
      nullif(new.raw_user_meta_data ->> 'name', ''),
      split_part(coalesce(new.email, ''), '@', 1)
    )
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user();

grant usage on schema public to anon, authenticated;
grant select, insert, update on table public.profiles to authenticated;
grant select, insert on table public.focus_sessions to authenticated;
