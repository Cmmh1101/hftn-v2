-- Newsletter subscribers, owned in our own database rather than living only
-- inside a third-party marketing tool. Mirrors contact_messages: no public
-- insert policy — the signup form writes via the service-role client from a
-- Server Action, same as the contact form already does.
create table subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text not null default '',
  source text not null default 'website',
  resend_contact_id text,
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table subscribers enable row level security;
create policy "subscribers_admin_all" on subscribers for all using (is_admin()) with check (is_admin());
