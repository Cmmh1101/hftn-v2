-- Adds a date to programs so jornada-category entries can show "when" in the
-- public Jornadas popup. Nullable since flagship/continuous programs don't
-- have a single date.
alter table programs add column program_date date;
