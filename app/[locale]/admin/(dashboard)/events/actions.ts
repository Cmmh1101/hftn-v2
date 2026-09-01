"use server";

import { revalidatePath } from "next/cache";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { uploadFile, deleteFile } from "@/lib/storage";
import type { ProgramStatus } from "@/lib/types";

function readFields(formData: FormData) {
  const goalDollars = Number(formData.get("goal") ?? 0) || 0;
  const raisedDollars = Number(formData.get("raised") ?? 0) || 0;
  return {
    name: String(formData.get("name") ?? "").trim(),
    event_date: String(formData.get("event_date") ?? ""),
    location: String(formData.get("location") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    goal_cents: Math.round(goalDollars * 100),
    raised_cents: Math.round(raisedDollars * 100),
    status: formData.get("status") as ProgramStatus,
    cta_label: String(formData.get("cta_label") ?? "").trim() || "Register",
  };
}

function revalidateEvents() {
  for (const locale of ["en", "es"]) {
    revalidatePath(`/${locale}/events`);
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/admin/events`);
    revalidatePath(`/${locale}/admin`);
  }
}

export async function createEvent(formData: FormData) {
  const fields = readFields(formData);
  if (!fields.name || !fields.event_date || !fields.status) return;

  const supabase = await createClient();
  const { data, error } = await supabase.from("events").insert(fields).select("id").single();
  if (error || !data) return;

  const photo = formData.get("photo") as File | null;
  if (photo && photo.size > 0) {
    const path = await uploadFile(photo, "events", data.id);
    await supabase.from("events").update({ photo_path: path }).eq("id", data.id);
  }

  revalidateEvents();
  redirect({ href: "/admin/events", locale: await getLocale() });
}

export async function updateEvent(id: string, formData: FormData) {
  const fields = readFields(formData);
  if (!fields.name || !fields.event_date || !fields.status) return;

  const supabase = await createClient();
  await supabase.from("events").update(fields).eq("id", id);

  const removePhoto = formData.get("removePhoto") === "on";
  const photo = formData.get("photo") as File | null;
  if (photo && photo.size > 0) {
    const path = await uploadFile(photo, "events", id);
    await supabase.from("events").update({ photo_path: path }).eq("id", id);
  } else if (removePhoto) {
    const { data: event } = await supabase.from("events").select("photo_path").eq("id", id).single();
    await deleteFile(event?.photo_path);
    await supabase.from("events").update({ photo_path: null }).eq("id", id);
  }

  revalidateEvents();
  redirect({ href: "/admin/events", locale: await getLocale() });
}

export async function deleteEvent(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  const { data: event } = await supabase.from("events").select("photo_path").eq("id", id).single();
  await supabase.from("events").delete().eq("id", id);
  await deleteFile(event?.photo_path);

  revalidateEvents();
}
