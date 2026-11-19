"use server";

import { revalidatePath } from "next/cache";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { uploadFile, deleteFile, getPublicUrl } from "@/lib/storage";
import { slugify } from "@/lib/slug";
import type { PostStatus, PostType } from "@/lib/types";

function readTags(input: FormDataEntryValue | null): string[] {
  const raw = String(input ?? "").trim();
  return raw ? raw.split(",").map((t) => t.trim()).filter(Boolean) : [];
}

// A bare "<p></p>" is what the editor leaves behind when a language is empty;
// store that as NULL so the site correctly falls back to the other language.
function readRichText(input: FormDataEntryValue | null): string {
  const html = String(input ?? "").trim();
  const hasContent = html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim().length > 0 || /<img\b/i.test(html);
  return hasContent ? html : "";
}

function readFields(formData: FormData) {
  const status = formData.get("status") as PostStatus;
  const publishedAtInput = String(formData.get("published_at") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const titleEs = String(formData.get("title_es") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const categoryEs = String(formData.get("category_es") ?? "").trim();
  const bodyEs = readRichText(formData.get("body_es"));
  return {
    title,
    title_es: titleEs || null,
    // One slug for both languages, so a shared link works in either one.
    slug: slugify(slugInput || title || titleEs),
    type: formData.get("type") as PostType,
    author: String(formData.get("author") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
    category_es: categoryEs || null,
    tags: readTags(formData.get("tags")),
    tags_es: readTags(formData.get("tags_es")),
    body: readRichText(formData.get("body")),
    body_es: bodyEs || null,
    status,
    published_at: publishedAtInput || (status === "published" ? new Date().toISOString().slice(0, 10) : null),
  };
}

// At least one language needs a title: it is the post's identity and its slug.
function isValid(fields: ReturnType<typeof readFields>) {
  return Boolean((fields.title || fields.title_es) && fields.slug && fields.type && fields.status);
}

function revalidatePosts() {
  for (const locale of ["en", "es"]) {
    revalidatePath(`/${locale}/stories`);
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/admin/content`);
  }
}

export async function createPost(formData: FormData) {
  const fields = readFields(formData);
  if (!isValid(fields)) return;

  const supabase = await createClient();
  const { data, error } = await supabase.from("posts").insert(fields).select("id").single();
  if (error || !data) return;

  const photo = formData.get("photo") as File | null;
  if (photo && photo.size > 0) {
    const path = await uploadFile(photo, "posts", data.id);
    await supabase.from("posts").update({ photo_path: path }).eq("id", data.id);
  }

  revalidatePosts();
  redirect({ href: "/admin/content", locale: await getLocale() });
}

export async function updatePost(id: string, formData: FormData) {
  const fields = readFields(formData);
  if (!isValid(fields)) return;

  const supabase = await createClient();
  await supabase.from("posts").update(fields).eq("id", id);

  const removePhoto = formData.get("removePhoto") === "on";
  const photo = formData.get("photo") as File | null;
  if (photo && photo.size > 0) {
    const path = await uploadFile(photo, "posts", id);
    await supabase.from("posts").update({ photo_path: path }).eq("id", id);
  } else if (removePhoto) {
    const { data: post } = await supabase.from("posts").select("photo_path").eq("id", id).single();
    await deleteFile(post?.photo_path);
    await supabase.from("posts").update({ photo_path: null }).eq("id", id);
  }

  revalidatePosts();
  redirect({ href: "/admin/content", locale: await getLocale() });
}

export async function deletePost(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  const { data: post } = await supabase.from("posts").select("photo_path").eq("id", id).single();
  await supabase.from("posts").delete().eq("id", id);
  await deleteFile(post?.photo_path);

  revalidatePosts();
}

export async function uploadEditorImage(formData: FormData): Promise<{ url: string } | { error: string }> {
  const file = formData.get("image") as File | null;
  if (!file || file.size === 0) return { error: "No file provided" };

  const id = crypto.randomUUID();
  const path = await uploadFile(file, "post-content", id);
  const url = getPublicUrl(path);
  return url ? { url } : { error: "Upload failed" };
}
