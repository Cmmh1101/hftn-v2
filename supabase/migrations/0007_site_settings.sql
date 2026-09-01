-- Singleton settings row for org-wide stats shown on Home/Impact (previously
-- hardcoded in page.tsx) and the three downloadable report PDFs on Impact
-- (previously non-functional placeholder labels with no real file behind
-- them). "id boolean primary key default true" + the check constraint is a
-- standard trick to guarantee exactly one row can ever exist.
create table site_settings (
  id boolean primary key default true,
  constraint site_settings_singleton check (id),
  countries_served text not null default '3',
  jornadas_completed text not null default '312',
  scholarships_stat text not null default '50+',
  families_reached text not null default '4,500+',
  total_deployed text not null default '$300K',
  annual_report_path text,
  form_990_path text,
  letter_501c3_path text,
  updated_at timestamptz not null default now()
);

insert into site_settings (id) values (true);

alter table site_settings enable row level security;
create policy "site_settings_public_read" on site_settings for select using (true);
create policy "site_settings_admin_write" on site_settings for update using (is_admin());
