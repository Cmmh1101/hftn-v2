-- Year-by-year impact history (e.g. "2021 · Alimentación · 3,000 platos de
-- sopa") — a different shape than the `programs` table (which tracks current
-- ongoing programs with a single running participant count, not a
-- historical ledger by year/category). is_goal distinguishes an achieved
-- milestone from a future target (e.g. "Meta: 100 estudiantes becados").
create table impact_milestones (
  id uuid primary key default gen_random_uuid(),
  period text not null,
  area text not null,
  impact_value text not null,
  is_goal boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table impact_milestones enable row level security;
create policy "impact_milestones_public_read" on impact_milestones for select using (true);
create policy "impact_milestones_admin_write" on impact_milestones for insert with check (is_admin());
create policy "impact_milestones_admin_update" on impact_milestones for update using (is_admin());
create policy "impact_milestones_admin_delete" on impact_milestones for delete using (is_admin());
