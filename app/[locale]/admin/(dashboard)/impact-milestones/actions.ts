"use server";

import { revalidatePath } from "next/cache";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";

function readFields(formData: FormData) {
  return {
    period: String(formData.get("period") ?? "").trim(),
    area: String(formData.get("area") ?? "").trim(),
    impact_value: String(formData.get("impact_value") ?? "").trim(),
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

export async function createMilestone(formData: FormData) {
  const fields = readFields(formData);
  if (!fields.period || !fields.area || !fields.impact_value) return;

  const supabase = await createClient();
  await supabase.from("impact_milestones").insert(fields);

  revalidateMilestones();
  redirect({ href: "/admin/impact-milestones", locale: await getLocale() });
}

export async function updateMilestone(id: string, formData: FormData) {
  const fields = readFields(formData);
  if (!fields.period || !fields.area || !fields.impact_value) return;

  const supabase = await createClient();
  await supabase.from("impact_milestones").update(fields).eq("id", id);

  revalidateMilestones();
  redirect({ href: "/admin/impact-milestones", locale: await getLocale() });
}

export async function deleteMilestone(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("impact_milestones").delete().eq("id", id);

  revalidateMilestones();
}
