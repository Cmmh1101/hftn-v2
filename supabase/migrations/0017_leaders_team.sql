-- Splits the people on the Leadership & Team page into two groups:
--   'leadership' = staff and directors (photo, role, optional bio)
--   'outreach'   = the volunteer Outreach Team (name and role)
-- Purely additive; every existing row stays in 'leadership'.
alter table leaders add column if not exists team text not null default 'leadership';
alter table leaders drop constraint if exists leaders_team_check;
alter table leaders add constraint leaders_team_check check (team in ('leadership', 'outreach'));
