"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { describeDbError, failure, success, type ActionResult } from "@/lib/action-result";
import { createClient } from "@/lib/supabase/server";

function readFields(formData: FormData) {
  return {
    period: String(formData.get("period") ?? "").trim(),
    area: String(formData.get("area") ?? "").trim(),
    area_es: String(formData.get("area_es") ?? "").trim() || null,
    impact_value: String(formData.get("impact_value") ?? "").trim(),
    impact_value_es: String(formData.get("impact_value_es") ?? "").trim() || null,
    is_goal: formData.get("is_goal") === "on",
    sort_order: Number(formData.get("sort_order") ?? 0) || 0,
  };
}

function revalidateMilestones() {
  for (const locale of ["en", "es"]) {
    revalidatePath(`/${locale}/impact`);
    revalidatePath(`/${locale}/admin/impact-milestones`);
  }
}

function isValid(fields: ReturnType<typeof readFields>) {
  return Boolean(fields.period && (fields.area || fields.area_es) && (fields.impact_value || fields.impact_value_es));
}

export async function createMilestone(formData: FormData): Promise<ActionResult> {
  const t = await getTranslations("feedback");
  const fields = readFields(formData);
  if (!isValid(fields)) return failure(t("requiredFields"));

  const supabase = await createClient();
  const { error } = await supabase.from("impact_milestones").insert(fields);
  if (error) return failure(describeDbError(error, t, "saveFailed"));

  revalidateMilestones();
  return success(t("created"), "/admin/impact-milestones");
}

export async function updateMilestone(id: string, formData: FormData): Promise<ActionResult> {
  const t = await getTranslations("feedback");
  const fields = readFields(formData);
  if (!isValid(fields)) return failure(t("requiredFields"));

  const supabase = await createClient();
  const { error } = await supabase.from("impact_milestones").update(fields).eq("id", id);
  if (error) return failure(describeDbError(error, t, "saveFailed"));

  revalidateMilestones();
  return success(t("saved"), "/admin/impact-milestones");
}

export async function deleteMilestone(formData: FormData): Promise<ActionResult> {
  const t = await getTranslations("feedback");
  const id = String(formData.get("id") ?? "");
  if (!id) return failure(t("deleteFailed"));

  const supabase = await createClient();
  const { error } = await supabase.from("impact_milestones").delete().eq("id", id);
  if (error) return failure(describeDbError(error, t, "deleteFailed"));

  revalidateMilestones();
  return success(t("deleted"));
}
