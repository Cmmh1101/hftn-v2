"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { describeDbError, failure, success, type ActionResult } from "@/lib/action-result";
import { deleteWithPhoto } from "@/lib/admin-crud";
import { createClient } from "@/lib/supabase/server";
import { uploadFile } from "@/lib/storage";

function revalidateGallery() {
  for (const locale of ["en", "es"]) {
    revalidatePath(`/${locale}/gallery`);
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/admin/gallery`);
  }
}

function readFields(formData: FormData) {
  return {
    location: String(formData.get("location") ?? "").trim(),
    region: String(formData.get("region") ?? "").trim(),
    caption: String(formData.get("caption") ?? "").trim(),
    caption_es: String(formData.get("caption_es") ?? "").trim() || null,
  };
}

export async function uploadGalleryPhoto(formData: FormData): Promise<ActionResult> {
  const t = await getTranslations("feedback");
  const fields = readFields(formData);
  const photo = formData.get("photo") as File | null;
  if (!fields.location || !photo || photo.size === 0) return failure(t("requiredFields"));

  const supabase = await createClient();
  const { data, error } = await supabase.from("gallery_photos").insert(fields).select("id").single();
  if (error || !data) return failure(describeDbError(error, t, "saveFailed"));

  try {
    const path = await uploadFile(photo, "gallery", data.id);
    await supabase.from("gallery_photos").update({ storage_path: path }).eq("id", data.id);
  } catch (e) {
    console.error("Gallery upload failed:", e);
    await supabase.from("gallery_photos").delete().eq("id", data.id);
    return failure(t("uploadFailed"));
  }

  revalidateGallery();
  return success(t("photoAdded"));
}

export async function updateGalleryPhoto(id: string, formData: FormData): Promise<ActionResult> {
  const t = await getTranslations("feedback");
  const fields = readFields(formData);
  if (!fields.location) return failure(t("requiredFields"));

  const supabase = await createClient();
  const { error } = await supabase.from("gallery_photos").update(fields).eq("id", id);
  if (error) return failure(describeDbError(error, t, "saveFailed"));

  const photo = formData.get("photo") as File | null;
  if (photo && photo.size > 0) {
    try {
      const path = await uploadFile(photo, "gallery", id);
      await supabase.from("gallery_photos").update({ storage_path: path }).eq("id", id);
    } catch (e) {
      console.error("Gallery photo replace failed:", e);
      revalidateGallery();
      return failure(t("uploadFailed"));
    }
  }

  revalidateGallery();
  return success(t("saved"), "/admin/gallery");
}

export async function deleteGalleryPhoto(formData: FormData): Promise<ActionResult> {
  return deleteWithPhoto({
    table: "gallery_photos",
    photoColumn: "storage_path",
    id: String(formData.get("id") ?? ""),
    revalidate: revalidateGallery,
  });
}
