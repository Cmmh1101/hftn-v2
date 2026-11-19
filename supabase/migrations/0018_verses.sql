-- Bible verses shown in the rotating verse banner on the Home page.
-- Each verse exists in both languages; the reference is translated too
-- ("Matthew 5:6–9" / "Mateo 5:6–9"). Hide a verse with `active = false`.
create table if not exists verses (
  id uuid primary key default gen_random_uuid(),
  reference text not null,
  reference_es text,
  text text not null,
  text_es text,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table verses enable row level security;
create policy "verses_public_read" on verses for select using (true);
create policy "verses_admin_write" on verses for insert with check (is_admin());
create policy "verses_admin_update" on verses for update using (is_admin());
create policy "verses_admin_delete" on verses for delete using (is_admin());
