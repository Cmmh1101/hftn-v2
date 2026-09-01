-- 0004's trigger also blocked the service-role key (no auth.uid() in that
-- context), which is too strict: service_role already bypasses RLS everywhere
-- else in this schema by design (it's a trusted, server-side-only credential),
-- so the role-change guard should only constrain actual end-user sessions.

create or replace function public.prevent_role_self_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role
     and auth.uid() is not null
     and not exists (select 1 from profiles where id = auth.uid() and role = 'admin') then
    raise exception 'Only admins can change roles';
  end if;
  return new;
end;
$$;
