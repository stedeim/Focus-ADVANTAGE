-- P0-4: signed-in users can delete the rows this app owns, and (when permitted)
-- remove their own auth.users row. profiles + focus_sessions already cascade
-- from auth.users, so deleting the auth user is enough when this function runs.

drop policy if exists "Users can delete own profile" on public.profiles;
create policy "Users can delete own profile"
  on public.profiles
  for delete
  using (auth.uid() = id);

drop policy if exists "Users can delete own sessions" on public.focus_sessions;
create policy "Users can delete own sessions"
  on public.focus_sessions
  for delete
  using (auth.uid() = user_id);

grant delete on table public.profiles to authenticated;
grant delete on table public.focus_sessions to authenticated;

create or replace function public.delete_own_account()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid;
begin
  uid := auth.uid();
  if uid is null then
    raise exception 'Not authenticated';
  end if;

  delete from public.focus_sessions where user_id = uid;
  delete from public.profiles where id = uid;
  delete from auth.users where id = uid;
end;
$$;

revoke all on function public.delete_own_account() from public;
grant execute on function public.delete_own_account() to authenticated;
