"use server";

import { revalidatePath } from "next/cache";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { uploadFile, deleteFile } from "@/lib/storage";

function readFields(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    role: String(formData.get("role") ?? "").trim(),
    bio: String(formData.get("bio") ?? "").trim(),
    sort_order: Number(formData.get("sort_order") ?? 0) || 0,
  };
}

function revalidateLeadership() {
  for (const locale of ["en", "es"]) {
    revalidatePath(`/${locale}/about`);
    revalidatePath(`/${locale}/about/team`);
    revalidatePath(`/${locale}/admin/leadership`);
  }
}

export async function createLeader(formData: FormData) {
  const fields = readFields(formData);
  if (!fields.name) return;

  const supabase = await createClient();
  const { data, error } = await supabase.from("leaders").insert(fields).select("id").single();
  if (error || !data) return;

  const photo = formData.get("photo") as File | null;
  if (photo && photo.size > 0) {
    const path = await uploadFile(photo, "leaders", data.id);
    await supabase.from("leaders").update({ photo_path: path }).eq("id", data.id);
  }

  revalidateLeadership();
  redirect({ href: "/admin/leadership", locale: await getLocale() });
}

export async function updateLeader(id: string, formData: FormData) {
  const fields = readFields(formData);
  if (!fields.name) return;

  const supabase = await createClient();
  await supabase.from("leaders").update(fields).eq("id", id);

  const removePhoto = formData.get("removePhoto") === "on";
  const photo = formData.get("photo") as File | null;
  if (photo && photo.size > 0) {
    const path = await uploadFile(photo, "leaders", id);
    await supabase.from("leaders").update({ photo_path: path }).eq("id", id);
  } else if (removePhoto) {
    const { data: leader } = await supabase.from("leaders").select("photo_path").eq("id", id).single();
    await deleteFile(leader?.photo_path);
    await supabase.from("leaders").update({ photo_path: null }).eq("id", id);
  }

  revalidateLeadership();
  redirect({ href: "/admin/leadership", locale: await getLocale() });
}

export async function deleteLeader(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  const { data: leader } = await supabase.from("leaders").select("photo_path").eq("id", id).single();
  await supabase.from("leaders").delete().eq("id", id);
  await deleteFile(leader?.photo_path);

  revalidateLeadership();
}
