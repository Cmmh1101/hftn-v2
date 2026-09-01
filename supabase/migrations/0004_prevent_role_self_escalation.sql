-- Fixes a privilege-escalation gap: "profiles_update_self_or_admin" (0001_init.sql)
-- lets a user update their OWN profile row with no restriction on which columns
-- change, so any authenticated admin-panel user (including "viewer") can set
-- their own role to "admin" via a direct Supabase call, bypassing the app UI
-- and its updateUserRole action (which has no server-side check of its own).
-- This trigger blocks any role change unless the acting user is already a true
-- admin — is_admin() isn't reused here because it treats "editor" as equal to
-- "admin", which would still allow an editor to self-promote.

create or replace function public.prevent_role_self_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role
     and not exists (select 1 from profiles where id = auth.uid() and role = 'admin') then
    raise exception 'Only admins can change roles';
  end if;
  return new;
end;
$$;

create trigger profiles_role_change_guard
before update on profiles
for each row execute function public.prevent_role_self_escalation();
