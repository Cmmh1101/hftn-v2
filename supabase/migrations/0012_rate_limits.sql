-- Basic abuse protection for public forms (contact, newsletter, checkout
-- creation), using Supabase itself rather than adding a new external
-- service (e.g. Upstash) just for this. Only ever touched via the
-- service-role client from Server Actions/route handlers, so no public
-- RLS policies are needed — same pattern as contact_messages/subscribers.
create table rate_limit_hits (
  id bigint generated always as identity primary key,
  bucket text not null,
  created_at timestamptz not null default now()
);

create index rate_limit_hits_bucket_created_at_idx on rate_limit_hits (bucket, created_at);

alter table rate_limit_hits enable row level security;
