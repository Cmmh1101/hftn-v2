"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { createWithPhoto, deleteWithPhoto, updateWithPhoto } from "@/lib/admin-crud";
import { failure, type ActionResult } from "@/lib/action-result";
import type { ProgramStatus } from "@/lib/types";

function readFields(formData: FormData) {
  const goalDollars = Number(formData.get("goal") ?? 0) || 0;
  const raisedDollars = Number(formData.get("raised") ?? 0) || 0;
  return {
    name: String(formData.get("name") ?? "").trim(),
    name_es: String(formData.get("name_es") ?? "").trim() || null,
    event_date: String(formData.get("event_date") ?? ""),
    location: String(formData.get("location") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    description_es: String(formData.get("description_es") ?? "").trim() || null,
    goal_cents: Math.round(goalDollars * 100),
    raised_cents: Math.round(raisedDollars * 100),
    status: formData.get("status") as ProgramStatus,
    cta_label: String(formData.get("cta_label") ?? "").trim() || "Register",
    cta_label_es: String(formData.get("cta_label_es") ?? "").trim() || null,
  };
}

function isValid(fields: ReturnType<typeof readFields>) {
  return Boolean((fields.name || fields.name_es) && fields.event_date && fields.status);
}

function revalidateEvents() {
  for (const locale of ["en", "es"]) {
    revalidatePath(`/${locale}/events`);
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/admin/events`);
    revalidatePath(`/${locale}/admin`);
  }
}

export async function createEvent(formData: FormData): Promise<ActionResult> {
  const fields = readFields(formData);
  if (!isValid(fields)) return failure((await getTranslations("feedback"))("requiredName"));
  return createWithPhoto({
    table: "events", folder: "events", fields, formData,
    revalidate: revalidateEvents, redirectTo: "/admin/events",
  });
}

export async function updateEvent(id: string, formData: FormData): Promise<ActionResult> {
  const fields = readFields(formData);
  if (!isValid(fields)) return failure((await getTranslations("feedback"))("requiredName"));
  return updateWithPhoto({
    table: "events", folder: "events", id, fields, formData,
    revalidate: revalidateEvents, redirectTo: "/admin/events",
  });
}

export async function deleteEvent(formData: FormData): Promise<ActionResult> {
  return deleteWithPhoto({ table: "events", id: String(formData.get("id") ?? ""), revalidate: revalidateEvents });
}
