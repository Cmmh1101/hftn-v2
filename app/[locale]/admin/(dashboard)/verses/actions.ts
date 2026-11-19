"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { describeDbError, failure, success, type ActionResult } from "@/lib/action-result";
import { createClient } from "@/lib/supabase/server";

function readFields(formData: FormData) {
  return {
    reference: String(formData.get("reference") ?? "").trim(),
    reference_es: String(formData.get("reference_es") ?? "").trim() || null,
    text: String(formData.get("text") ?? "").trim(),
    text_es: String(formData.get("text_es") ?? "").trim() || null,
    sort_order: Number(formData.get("sort_order") ?? 0) || 0,
    active: formData.get("active") === "on",
  };
}

function revalidateVerses() {
  for (const locale of ["en", "es"]) {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/admin/verses`);
  }
}

// A verse needs its text and reference in at least one language.
const isValid = (f: ReturnType<typeof readFields>) => Boolean((f.text || f.text_es) && (f.reference || f.reference_es));

export async function createVerse(formData: FormData): Promise<ActionResult> {
  const t = await getTranslations("feedback");
  const fields = readFields(formData);
  if (!isValid(fields)) return failure(t("requiredFields"));
  const supabase = await createClient();
  const { error } = await supabase.from("verses").insert(fields);
  if (error) return failure(describeDbError(error, t, "saveFailed"));
  revalidateVerses();
  return success(t("created"), "/admin/verses");
}

export async function updateVerse(id: string, formData: FormData): Promise<ActionResult> {
  const t = await getTranslations("feedback");
  const fields = readFields(formData);
  if (!isValid(fields)) return failure(t("requiredFields"));
  const supabase = await createClient();
  const { error } = await supabase.from("verses").update(fields).eq("id", id);
  if (error) return failure(describeDbError(error, t, "saveFailed"));
  revalidateVerses();
  return success(t("saved"), "/admin/verses");
}

export async function deleteVerse(formData: FormData): Promise<ActionResult> {
  const t = await getTranslations("feedback");
  const id = String(formData.get("id") ?? "");
  if (!id) return failure(t("deleteFailed"));
  const supabase = await createClient();
  const { error } = await supabase.from("verses").delete().eq("id", id);
  if (error) return failure(describeDbError(error, t, "deleteFailed"));
  revalidateVerses();
  return success(t("deleted"));
}
