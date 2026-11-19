-- Bilingual content (EN/ES).
--
-- The existing text columns remain the ENGLISH version; each translatable field
-- gains a nullable "_es" sibling holding the Spanish version. The site shows the
-- visitor's language and falls back to the other one when a translation is
-- missing, so a row can be published in a single language and translated later.
--
-- Purely additive: nothing is renamed or dropped, so it is safe to run before or
-- after the matching code is deployed (until it runs, saving from the admin
-- editor fails because the new columns do not exist yet).
--
-- Shared (not translated) on purpose: slug, type, status, dates, author,
-- photos, proper nouns such as place names, and enumerations (program
-- type/region/category), which the UI already translates.

alter table posts add column if not exists title_es text;
alter table posts add column if not exists category_es text;
alter table posts add column if not exists tags_es text[] not null default '{}';
alter table posts add column if not exists body_es text;

alter table programs add column if not exists name_es text;
alter table programs add column if not exists summary_es text;

alter table events add column if not exists name_es text;
alter table events add column if not exists description_es text;
alter table events add column if not exists cta_label_es text;

alter table leaders add column if not exists role_es text;
alter table leaders add column if not exists bio_es text;

alter table gallery_photos add column if not exists caption_es text;

alter table impact_milestones add column if not exists area_es text;
alter table impact_milestones add column if not exists impact_value_es text;
