"use server";

import { revalidatePath } from "next/cache";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { uploadFile, deleteFile } from "@/lib/storage";
import type { PostStatus, PostType } from "@/lib/types";

function readFields(formData: FormData) {
  const status = formData.get("status") as PostStatus;
  const publishedAtInput = String(formData.get("published_at") ?? "").trim();
  return {
    title: String(formData.get("title") ?? "").trim(),
    type: formData.get("type") as PostType,
    author: String(formData.get("author") ?? "").trim(),
    tag: String(formData.get("tag") ?? "").trim(),
    body: String(formData.get("body") ?? "").trim(),
    status,
    published_at: publishedAtInput || (status === "published" ? new Date().toISOString().slice(0, 10) : null),
  };
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
  if (!fields.title || !fields.type || !fields.status) return;

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
  if (!fields.title || !fields.type || !fields.status) return;

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
