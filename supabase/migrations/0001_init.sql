-- Hope For The Nations — core schema

create extension if not exists "pgcrypto";

-- ── profiles (admin dashboard users only; public site has no accounts) ────
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default '',
  role text not null default 'viewer' check (role in ('admin', 'editor', 'viewer')),
  region text not null default '',
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role in ('admin', 'editor')
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name) values (new.id, coalesce(new.raw_user_meta_data ->> 'name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── programs & jornadas ─────────────────────────────────────────────────
create table programs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('flagship', 'continuous', 'jornada', 'relief')),
  type text not null default '',
  region text not null default '',
  participants integer not null default 0,
  status text not null default 'Active' check (status in ('Active', 'Planned', 'Completed')),
  summary text not null default '',
  created_at timestamptz not null default now()
);

-- ── fundraising events ──────────────────────────────────────────────────
create table events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  event_date date not null,
  location text not null default '',
  description text not null default '',
  goal_cents bigint not null default 0,
  raised_cents bigint not null default 0,
  status text not null default 'Planned' check (status in ('Active', 'Planned', 'Completed')),
  cta_label text not null default 'Register',
  created_at timestamptz not null default now()
);

-- ── donations ───────────────────────────────────────────────────────────
create table donations (
  id uuid primary key default gen_random_uuid(),
  donor_name text not null default '',
  donor_email text not null,
  amount_cents bigint not null,
  kind text not null check (kind in ('one_time', 'monthly', 'sponsorship')),
  program_id uuid references programs (id) on delete set null,
  event_id uuid references events (id) on delete set null,
  stripe_payment_intent_id text,
  stripe_subscription_id text,
  created_at timestamptz not null default now()
);

-- ── blog posts & stories of hope ───────────────────────────────────────
create table posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null check (type in ('blog', 'story')),
  author text not null default '',
  tag text not null default '',
  body text not null default '',
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now()
);

-- ── gallery photos ──────────────────────────────────────────────────────
create table gallery_photos (
  id uuid primary key default gen_random_uuid(),
  location text not null,
  region text not null default '',
  storage_path text,
  caption text not null default '',
  program_id uuid references programs (id) on delete set null,
  created_at timestamptz not null default now()
);

-- ── leadership ──────────────────────────────────────────────────────────
create table leaders (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default '',
  photo_path text,
  sort_order integer not null default 0
);

-- ── contact form submissions ────────────────────────────────────────────
create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  handled boolean not null default false,
  created_at timestamptz not null default now()
);

-- ── row level security ──────────────────────────────────────────────────
alter table profiles enable row level security;
alter table programs enable row level security;
alter table events enable row level security;
alter table donations enable row level security;
alter table posts enable row level security;
alter table gallery_photos enable row level security;
alter table leaders enable row level security;
alter table contact_messages enable row level security;

-- profiles: admins manage everyone, users read/update themselves
create policy "profiles_select_self_or_admin" on profiles for select
  using (id = auth.uid() or is_admin());
create policy "profiles_update_self_or_admin" on profiles for update
  using (id = auth.uid() or is_admin());
create policy "profiles_admin_all" on profiles for all
  using (is_admin()) with check (is_admin());

-- programs / events / gallery_photos / leaders: public read, admin write
create policy "programs_public_read" on programs for select using (true);
create policy "programs_admin_write" on programs for insert with check (is_admin());
create policy "programs_admin_update" on programs for update using (is_admin());
create policy "programs_admin_delete" on programs for delete using (is_admin());

create policy "events_public_read" on events for select using (true);
create policy "events_admin_write" on events for insert with check (is_admin());
create policy "events_admin_update" on events for update using (is_admin());
create policy "events_admin_delete" on events for delete using (is_admin());

create policy "gallery_public_read" on gallery_photos for select using (true);
create policy "gallery_admin_write" on gallery_photos for insert with check (is_admin());
create policy "gallery_admin_update" on gallery_photos for update using (is_admin());
create policy "gallery_admin_delete" on gallery_photos for delete using (is_admin());

create policy "leaders_public_read" on leaders for select using (true);
create policy "leaders_admin_write" on leaders for insert with check (is_admin());
create policy "leaders_admin_update" on leaders for update using (is_admin());
create policy "leaders_admin_delete" on leaders for delete using (is_admin());

-- posts: public reads only published rows, admins read/write everything
create policy "posts_public_read_published" on posts for select using (status = 'published');
create policy "posts_admin_read_all" on posts for select using (is_admin());
create policy "posts_admin_write" on posts for insert with check (is_admin());
create policy "posts_admin_update" on posts for update using (is_admin());
create policy "posts_admin_delete" on posts for delete using (is_admin());

-- donations / contact_messages: never public; server uses the service-role
-- key to insert (bypasses RLS), admins can read via the dashboard
create policy "donations_admin_read" on donations for select using (is_admin());
create policy "contact_admin_read" on contact_messages for select using (is_admin());
create policy "contact_admin_update" on contact_messages for update using (is_admin());
