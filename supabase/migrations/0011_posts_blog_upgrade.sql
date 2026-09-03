-- Upgrades posts into a real blog: individual pages need a slug, and content
-- gets a genuine category/tags split for future filtering (category was
-- already functioning as a single label via the old "tag" column, so it's
-- renamed rather than duplicated; "tags" is new, for multiple free-form
-- labels per post).
alter table posts rename column tag to category;
alter table posts add column tags text[] not null default '{}';
alter table posts add column slug text;

update posts set slug = trim(both '-' from regexp_replace(lower(trim(title)), '[^a-z0-9]+', '-', 'g'))
where slug is null;

alter table posts alter column slug set not null;
alter table posts add constraint posts_slug_unique unique (slug);
