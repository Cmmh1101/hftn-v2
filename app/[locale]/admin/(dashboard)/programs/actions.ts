"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { createWithPhoto, deleteWithPhoto, updateWithPhoto } from "@/lib/admin-crud";
import { failure, type ActionResult } from "@/lib/action-result";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slug";
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
    description: String(formData.get("description") ?? "").trim(),
    description_es: String(formData.get("description_es") ?? "").trim() || null,
    video_url: String(formData.get("video_url") ?? "").trim() || null,
    program_date: String(formData.get("program_date") ?? "").trim() || null,
    website_url: String(formData.get("website_url") ?? "").trim() || null,
  };
}

function isValid(fields: ReturnType<typeof readFields>) {
  return Boolean((fields.name || fields.name_es) && fields.category && fields.status);
}

// A readable, unique URL for the program's own page ("Hope Sports" -> "hope-sports").
async function uniqueSlug(name: string, ignoreId?: string): Promise<string> {
  const base = slugify(name) || "program";
  const supabase = await createClient();
  const { data } = await supabase.from("programs").select("id, slug").like("slug", `${base}%`);
  const taken = new Set((data ?? []).filter((r) => r.id !== ignoreId).map((r) => r.slug));
  if (!taken.has(base)) return base;
  for (let n = 2; ; n++) if (!taken.has(`${base}-${n}`)) return `${base}-${n}`;
}

function revalidatePrograms() {
  for (const locale of ["en", "es"]) {
    revalidatePath(`/${locale}/programs`);
    revalidatePath(`/${locale}/programs/[slug]`, "page");
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/admin/programs`);
    revalidatePath(`/${locale}/admin`);
  }
}

export async function createProgram(formData: FormData): Promise<ActionResult> {
  const fields = readFields(formData);
  if (!isValid(fields)) return failure((await getTranslations("feedback"))("requiredName"));
  const slug = await uniqueSlug(fields.name || fields.name_es || "");
  return createWithPhoto({
    table: "programs", folder: "programs", fields: { ...fields, slug }, formData,
    revalidate: revalidatePrograms, redirectTo: "/admin/programs",
  });
}

export async function updateProgram(id: string, formData: FormData): Promise<ActionResult> {
  const fields = readFields(formData);
  if (!isValid(fields)) return failure((await getTranslations("feedback"))("requiredName"));
  // The slug (and so the public URL) is fixed once it exists; only fill it in
  // for programs created before they had pages.
  const supabase = await createClient();
  const { data: current } = await supabase.from("programs").select("slug").eq("id", id).maybeSingle();
  const withSlug = current?.slug ? fields : { ...fields, slug: await uniqueSlug(fields.name || fields.name_es || "", id) };
  return updateWithPhoto({
    table: "programs", folder: "programs", id, fields: withSlug, formData,
    revalidate: revalidatePrograms, redirectTo: "/admin/programs",
  });
}

export async function deleteProgram(formData: FormData): Promise<ActionResult> {
  return deleteWithPhoto({ table: "programs", id: String(formData.get("id") ?? ""), revalidate: revalidatePrograms });
}
