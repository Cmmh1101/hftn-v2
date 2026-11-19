-- Program detail pages, per-program photo galleries, sponsors and a home video.
--
-- Purely additive (nothing renamed or dropped), so it is safe to run before or
-- after the matching code is deployed. Until it runs, the new public sections
-- simply stay empty and saving a program from the admin editor fails because
-- the new columns do not exist yet.

-- ── Programs: own page, long description, optional video ─────────────────
alter table programs add column if not exists slug text;
alter table programs add column if not exists description text not null default '';
alter table programs add column if not exists description_es text;
-- YouTube link or a direct .mp4 URL.
alter table programs add column if not exists video_url text;

-- Slugs for the rows that already exist ("Hope Sports" -> "hope-sports",
-- "Copán Relief" -> "copan-relief").
update programs
set slug = trim(both '-' from lower(regexp_replace(
  translate(name, 'áéíóúüñÁÉÍÓÚÜÑ', 'aeiouunAEIOUUN'), '[^a-zA-Z0-9]+', '-', 'g')))
where slug is null;

-- Unique, but nullable on purpose: a row inserted by an older deploy (which
-- does not know about slugs) must not be rejected.
create unique index if not exists programs_slug_key on programs (slug);

-- ── Program photos: any number of photos per program ─────────────────────
create table if not exists program_photos (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references programs (id) on delete cascade,
  storage_path text not null,
  caption text not null default '',
  caption_es text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists program_photos_program_idx on program_photos (program_id, sort_order);

alter table program_photos enable row level security;
create policy "program_photos_public_read" on program_photos for select using (true);
create policy "program_photos_admin_write" on program_photos for insert with check (is_admin());
create policy "program_photos_admin_update" on program_photos for update using (is_admin());
create policy "program_photos_admin_delete" on program_photos for delete using (is_admin());

-- ── Sponsors & partners (logo wall) ──────────────────────────────────────
create table if not exists sponsors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_path text,
  website_url text,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table sponsors enable row level security;
create policy "sponsors_public_read" on sponsors for select using (true);
create policy "sponsors_admin_write" on sponsors for insert with check (is_admin());
create policy "sponsors_admin_update" on sponsors for update using (is_admin());
create policy "sponsors_admin_delete" on sponsors for delete using (is_admin());

-- ── Home page video ──────────────────────────────────────────────────────
-- YouTube link or a direct .mp4 URL; the section is hidden while this is empty.
alter table site_settings add column if not exists home_video_url text;

-- ── Media bucket: allow short videos ─────────────────────────────────────
-- The bucket only accepted images and PDFs, up to 20 MB. This also allows
-- MP4/WebM videos (up to 50 MB, the Supabase free-plan maximum) for the home
-- video and program videos. Upload them from Supabase > Storage > media and
-- paste the file's public address into the video field.
update storage.buckets
set file_size_limit = 52428800,
    allowed_mime_types = array[
      'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf',
      'video/mp4', 'video/webm'
    ]
where id = 'media';
