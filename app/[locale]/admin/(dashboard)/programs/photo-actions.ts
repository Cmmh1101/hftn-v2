"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { describeDbError, failure, success, type ActionResult } from "@/lib/action-result";
import { createClient } from "@/lib/supabase/server";
import { deleteFile, uploadFile } from "@/lib/storage";

function revalidateProgramPages() {
  for (const locale of ["en", "es"]) {
    revalidatePath(`/${locale}/programs`);
    revalidatePath(`/${locale}/programs/[slug]`, "page");
    revalidatePath(`/${locale}/admin/programs/[id]/edit`, "page");
  }
}

/** Adds ONE photo to a program. The editor calls it once per file so each upload stays small. */
export async function addProgramPhoto(programId: string, formData: FormData): Promise<ActionResult> {
  const t = await getTranslations("feedback");
  const photo = formData.get("photo") as File | null;
  if (!programId || !photo || photo.size === 0) return failure(t("requiredFields"));

  const supabase = await createClient();
  const id = randomUUID();

  let path: string;
  try {
    path = await uploadFile(photo, "program-photos", id);
  } catch (e) {
    console.error("Program photo upload failed:", e);
    return failure(t("uploadFailed"));
  }

  const { data: last } = await supabase
    .from("program_photos")
    .select("sort_order")
    .eq("program_id", programId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("program_photos").insert({
    id,
    program_id: programId,
    storage_path: path,
    caption: String(formData.get("caption") ?? "").trim(),
    caption_es: String(formData.get("caption_es") ?? "").trim() || null,
    sort_order: (last?.sort_order ?? 0) + 1,
  });
  if (error) {
    await deleteFile(path);
    return failure(describeDbError(error, t, "saveFailed"));
  }

  revalidateProgramPages();
  return success(t("photoAdded"));
}

export async function deleteProgramPhoto(formData: FormData): Promise<ActionResult> {
  const t = await getTranslations("feedback");
  const id = String(formData.get("id") ?? "");
  if (!id) return failure(t("deleteFailed"));

  const supabase = await createClient();
  const { data: row } = await supabase.from("program_photos").select("storage_path").eq("id", id).single();
  const { error } = await supabase.from("program_photos").delete().eq("id", id);
  if (error) return failure(describeDbError(error, t, "deleteFailed"));
  await deleteFile(row?.storage_path);

  revalidateProgramPages();
  return success(t("deleted"));
}
