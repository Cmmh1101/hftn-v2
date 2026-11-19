"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { createWithPhoto, deleteWithPhoto, updateWithPhoto } from "@/lib/admin-crud";
import { failure, type ActionResult } from "@/lib/action-result";
import type { ProgramCategory, ProgramStatus } from "@/lib/types";

function readFields(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    name_es: String(formData.get("name_es") ?? "").trim() || null,
    category: formData.get("category") as ProgramCategory,
    type: String(formData.get("type") ?? "").trim(),
    region: String(formData.get("region") ?? "").trim(),
    participants: Number(formData.get("participants") ?? 0) || 0,
    status: formData.get("status") as ProgramStatus,
    summary: String(formData.get("summary") ?? "").trim(),
    summary_es: String(formData.get("summary_es") ?? "").trim() || null,
    program_date: String(formData.get("program_date") ?? "").trim() || null,
    website_url: String(formData.get("website_url") ?? "").trim() || null,
  };
}

function isValid(fields: ReturnType<typeof readFields>) {
  return Boolean((fields.name || fields.name_es) && fields.category && fields.status);
}

function revalidatePrograms() {
  for (const locale of ["en", "es"]) {
    revalidatePath(`/${locale}/programs`);
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/admin/programs`);
    revalidatePath(`/${locale}/admin`);
  }
}

export async function createProgram(formData: FormData): Promise<ActionResult> {
  const fields = readFields(formData);
  if (!isValid(fields)) return failure((await getTranslations("feedback"))("requiredName"));
  return createWithPhoto({
    table: "programs", folder: "programs", fields, formData,
    revalidate: revalidatePrograms, redirectTo: "/admin/programs",
  });
}

export async function updateProgram(id: string, formData: FormData): Promise<ActionResult> {
  const fields = readFields(formData);
  if (!isValid(fields)) return failure((await getTranslations("feedback"))("requiredName"));
  return updateWithPhoto({
    table: "programs", folder: "programs", id, fields, formData,
    revalidate: revalidatePrograms, redirectTo: "/admin/programs",
  });
}

export async function deleteProgram(formData: FormData): Promise<ActionResult> {
  return deleteWithPhoto({ table: "programs", id: String(formData.get("id") ?? ""), revalidate: revalidatePrograms });
}
