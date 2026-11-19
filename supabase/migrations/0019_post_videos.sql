-- Stories and blog posts can carry a video (YouTube link or an uploaded file).
--
-- Additive and safe to run before or after the matching code is deployed.

alter table posts add column if not exists video_url text;

-- Admins upload videos straight from the browser (they are too large to pass
-- through the app's server, which accepts about 5 MB per request). The `media`
-- bucket already allows MP4/WebM up to 50 MB (migration 0016); this only lets a
-- signed-in admin or editor add files under post-videos/.
drop policy if exists "media_admin_upload_post_videos" on storage.objects;
create policy "media_admin_upload_post_videos" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media' and (storage.foldername(name))[1] = 'post-videos' and public.is_admin());
