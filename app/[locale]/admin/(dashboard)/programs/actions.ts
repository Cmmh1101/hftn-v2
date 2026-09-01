"use server";

import { revalidatePath } from "next/cache";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { uploadFile, deleteFile } from "@/lib/storage";
import type { ProgramCategory, ProgramStatus } from "@/lib/types";

function readFields(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    category: formData.get("category") as ProgramCategory,
    type: String(formData.get("type") ?? "").trim(),
    region: String(formData.get("region") ?? "").trim(),
    participants: Number(formData.get("participants") ?? 0) || 0,
    status: formData.get("status") as ProgramStatus,
    summary: String(formData.get("summary") ?? "").trim(),
    program_date: String(formData.get("program_date") ?? "").trim() || null,
  };
}

function revalidatePrograms() {
  for (const locale of ["en", "es"]) {
    revalidatePath(`/${locale}/programs`);
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/admin/programs`);
    revalidatePath(`/${locale}/admin`);
  }
}

export async function createProgram(formData: FormData) {
  const fields = readFields(formData);
  if (!fields.name || !fields.category || !fields.status) return;

  const supabase = await createClient();
  const { data, error } = await supabase.from("programs").insert(fields).select("id").single();
  if (error || !data) return;

  const photo = formData.get("photo") as File | null;
  if (photo && photo.size > 0) {
    const path = await uploadFile(photo, "programs", data.id);
    await supabase.from("programs").update({ photo_path: path }).eq("id", data.id);
  }

  revalidatePrograms();
  redirect({ href: "/admin/programs", locale: await getLocale() });
}

export async function updateProgram(id: string, formData: FormData) {
  const fields = readFields(formData);
  if (!fields.name || !fields.category || !fields.status) return;

  const supabase = await createClient();
  await supabase.from("programs").update(fields).eq("id", id);

  const removePhoto = formData.get("removePhoto") === "on";
  const photo = formData.get("photo") as File | null;
  if (photo && photo.size > 0) {
    const path = await uploadFile(photo, "programs", id);
    await supabase.from("programs").update({ photo_path: path }).eq("id", id);
  } else if (removePhoto) {
    const { data: program } = await supabase.from("programs").select("photo_path").eq("id", id).single();
    await deleteFile(program?.photo_path);
    await supabase.from("programs").update({ photo_path: null }).eq("id", id);
  }

  revalidatePrograms();
  redirect({ href: "/admin/programs", locale: await getLocale() });
}

export async function deleteProgram(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  const { data: program } = await supabase.from("programs").select("photo_path").eq("id", id).single();
  await supabase.from("programs").delete().eq("id", id);
  await deleteFile(program?.photo_path);

  revalidatePrograms();
}
