"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { createWithPhoto, deleteWithPhoto, updateWithPhoto } from "@/lib/admin-crud";
import { failure, type ActionResult } from "@/lib/action-result";

function readFields(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    role: String(formData.get("role") ?? "").trim(),
    role_es: String(formData.get("role_es") ?? "").trim() || null,
    bio: String(formData.get("bio") ?? "").trim(),
    bio_es: String(formData.get("bio_es") ?? "").trim() || null,
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

export async function createLeader(formData: FormData): Promise<ActionResult> {
  const fields = readFields(formData);
  if (!fields.name) return failure((await getTranslations("feedback"))("requiredFields"));
  return createWithPhoto({
    table: "leaders", folder: "leaders", fields, formData,
    revalidate: revalidateLeadership, redirectTo: "/admin/leadership",
  });
}

export async function updateLeader(id: string, formData: FormData): Promise<ActionResult> {
  const fields = readFields(formData);
  if (!fields.name) return failure((await getTranslations("feedback"))("requiredFields"));
  return updateWithPhoto({
    table: "leaders", folder: "leaders", id, fields, formData,
    revalidate: revalidateLeadership, redirectTo: "/admin/leadership",
  });
}

export async function deleteLeader(formData: FormData): Promise<ActionResult> {
  return deleteWithPhoto({ table: "leaders", id: String(formData.get("id") ?? ""), revalidate: revalidateLeadership });
}
