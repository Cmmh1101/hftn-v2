-- Lets the home page hero photo be changed from Admin > Settings instead of
-- being hardcoded. Nullable: when empty the site shows the "dawn" placeholder.
alter table site_settings add column hero_photo_path text;
