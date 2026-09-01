"use server";

import { revalidatePath } from "next/cache";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { uploadFile, deleteFile } from "@/lib/storage";

function revalidateGallery() {
  for (const locale of ["en", "es"]) {
    revalidatePath(`/${locale}/gallery`);
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/admin/gallery`);
  }
}

export async function uploadGalleryPhoto(formData: FormData) {
  const location = String(formData.get("location") ?? "").trim();
  const region = String(formData.get("region") ?? "").trim();
  const caption = String(formData.get("caption") ?? "").trim();
  const photo = formData.get("photo") as File | null;
  if (!location || !photo || photo.size === 0) return;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gallery_photos")
    .insert({ location, region, caption })
    .select("id")
    .single();
  if (error || !data) return;

  const path = await uploadFile(photo, "gallery", data.id);
  await supabase.from("gallery_photos").update({ storage_path: path }).eq("id", data.id);

  revalidateGallery();
}

export async function updateGalleryPhoto(id: string, formData: FormData) {
  const location = String(formData.get("location") ?? "").trim();
  const region = String(formData.get("region") ?? "").trim();
  const caption = String(formData.get("caption") ?? "").trim();
  if (!location) return;

  const supabase = await createClient();
  await supabase.from("gallery_photos").update({ location, region, caption }).eq("id", id);

  const photo = formData.get("photo") as File | null;
  if (photo && photo.size > 0) {
    const path = await uploadFile(photo, "gallery", id);
    await supabase.from("gallery_photos").update({ storage_path: path }).eq("id", id);
  }

  revalidateGallery();
  redirect({ href: "/admin/gallery", locale: await getLocale() });
}

export async function deleteGalleryPhoto(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  const { data: photo } = await supabase.from("gallery_photos").select("storage_path").eq("id", id).single();
  await supabase.from("gallery_photos").delete().eq("id", id);
  await deleteFile(photo?.storage_path);

  revalidateGallery();
}
