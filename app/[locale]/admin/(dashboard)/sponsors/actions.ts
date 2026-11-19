"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { createWithPhoto, deleteWithPhoto, updateWithPhoto } from "@/lib/admin-crud";
import { failure, type ActionResult } from "@/lib/action-result";

function normalizeUrl(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function readFields(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    website_url: normalizeUrl(String(formData.get("website_url") ?? "")),
    sort_order: Number(formData.get("sort_order") ?? 0) || 0,
    active: formData.get("active") === "on",
  };
}

function revalidateSponsors() {
  for (const locale of ["en", "es"]) {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/about`);
    revalidatePath(`/${locale}/admin/sponsors`);
  }
}

const COMMON = { table: "sponsors", folder: "sponsors", photoColumn: "logo_path", redirectTo: "/admin/sponsors" } as const;

export async function createSponsor(formData: FormData): Promise<ActionResult> {
  const fields = readFields(formData);
  if (!fields.name) return failure((await getTranslations("feedback"))("requiredFields"));
  return createWithPhoto({ ...COMMON, fields, formData, revalidate: revalidateSponsors });
}

export async function updateSponsor(id: string, formData: FormData): Promise<ActionResult> {
  const fields = readFields(formData);
  if (!fields.name) return failure((await getTranslations("feedback"))("requiredFields"));
  return updateWithPhoto({ ...COMMON, id, fields, formData, revalidate: revalidateSponsors });
}

export async function deleteSponsor(formData: FormData): Promise<ActionResult> {
  return deleteWithPhoto({
    table: "sponsors",
    photoColumn: "logo_path",
    id: String(formData.get("id") ?? ""),
    revalidate: revalidateSponsors,
  });
}
