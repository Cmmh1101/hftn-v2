"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { createWithPhoto, deleteWithPhoto, updateWithPhoto } from "@/lib/admin-crud";
import { failure, type ActionResult } from "@/lib/action-result";
import { uploadFile, getPublicUrl } from "@/lib/storage";
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

export async function createPost(formData: FormData): Promise<ActionResult> {
  const fields = readFields(formData);
  if (!isValid(fields)) return failure((await getTranslations("feedback"))("requiredName"));
  return createWithPhoto({
    table: "posts", folder: "posts", fields, formData,
    revalidate: revalidatePosts, redirectTo: "/admin/content",
  });
}

export async function updatePost(id: string, formData: FormData): Promise<ActionResult> {
  const fields = readFields(formData);
  if (!isValid(fields)) return failure((await getTranslations("feedback"))("requiredName"));
  return updateWithPhoto({
    table: "posts", folder: "posts", id, fields, formData,
    revalidate: revalidatePosts, redirectTo: "/admin/content",
  });
}

export async function deletePost(formData: FormData): Promise<ActionResult> {
  return deleteWithPhoto({ table: "posts", id: String(formData.get("id") ?? ""), revalidate: revalidatePosts });
}

export async function uploadEditorImage(formData: FormData): Promise<{ url: string } | { error: string }> {
  const t = await getTranslations("feedback");
  const file = formData.get("image") as File | null;
  if (!file || file.size === 0) return { error: t("uploadFailed") };

  try {
    const path = await uploadFile(file, "post-content", crypto.randomUUID());
    const url = getPublicUrl(path);
    return url ? { url } : { error: t("uploadFailed") };
  } catch (e) {
    console.error("Editor image upload failed:", e);
    return { error: t("uploadFailed") };
  }
}
