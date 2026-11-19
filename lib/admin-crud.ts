import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { deleteFile, uploadFile } from "@/lib/storage";
import { describeDbError, failure, success, type ActionResult } from "@/lib/action-result";

// Shared create / update / delete for admin content that has one optional photo.
// Every path returns an ActionResult, so the editor can tell the user what
// happened — including the cases that used to fail silently (validation, a
// database error, a rejected upload). Server-only: imported by actions files.

type Common = {
  table: string;
  /** Storage folder for this table's photos. */
  folder: string;
  /** Column holding the photo path. */
  photoColumn?: string;
  revalidate: () => void;
  /** Where to go after a successful save (admin list page). */
  redirectTo: string;
};

export async function createWithPhoto({
  table,
  folder,
  photoColumn = "photo_path",
  fields,
  formData,
  revalidate,
  redirectTo,
}: Common & { fields: Record<string, unknown>; formData: FormData }): Promise<ActionResult> {
  const t = await getTranslations("feedback");
  const supabase = await createClient();

  const { data, error } = await supabase.from(table).insert(fields).select("id").single();
  if (error || !data) {
    if (error?.code === "23505") return failure(t("slugTaken"));
    return failure(describeDbError(error, t, "saveFailed"));
  }

  const photo = formData.get("photo") as File | null;
  if (photo && photo.size > 0) {
    try {
      const path = await uploadFile(photo, folder, data.id);
      await supabase.from(table).update({ [photoColumn]: path }).eq("id", data.id);
    } catch (e) {
      console.error(`Photo upload failed for ${table}:`, e);
      // Roll the row back so retrying the form doesn't leave a duplicate behind.
      await supabase.from(table).delete().eq("id", data.id);
      return failure(t("uploadFailed"));
    }
  }

  revalidate();
  return success(t("created"), redirectTo);
}

export async function updateWithPhoto({
  table,
  folder,
  photoColumn = "photo_path",
  id,
  fields,
  formData,
  revalidate,
  redirectTo,
}: Common & { id: string; fields: Record<string, unknown>; formData: FormData }): Promise<ActionResult> {
  const t = await getTranslations("feedback");
  const supabase = await createClient();

  const { error } = await supabase.from(table).update(fields).eq("id", id);
  if (error) {
    if (error.code === "23505") return failure(t("slugTaken"));
    return failure(describeDbError(error, t, "saveFailed"));
  }

  const removePhoto = formData.get("removePhoto") === "on";
  const photo = formData.get("photo") as File | null;
  try {
    if (photo && photo.size > 0) {
      const path = await uploadFile(photo, folder, id);
      await supabase.from(table).update({ [photoColumn]: path }).eq("id", id);
    } else if (removePhoto) {
      const { data: row } = await supabase.from(table).select(photoColumn).eq("id", id).single();
      await deleteFile((row as unknown as Record<string, string | null> | null)?.[photoColumn]);
      await supabase.from(table).update({ [photoColumn]: null }).eq("id", id);
    }
  } catch (e) {
    console.error(`Photo update failed for ${table}:`, e);
    revalidate();
    return failure(t("uploadFailed"));
  }

  revalidate();
  return success(t("saved"), redirectTo);
}

export async function deleteWithPhoto({
  table,
  photoColumn = "photo_path",
  id,
  revalidate,
}: Pick<Common, "table" | "photoColumn" | "revalidate"> & { id: string }): Promise<ActionResult> {
  const t = await getTranslations("feedback");
  if (!id) return failure(t("deleteFailed"));
  const supabase = await createClient();

  const { data: row } = await supabase.from(table).select(photoColumn).eq("id", id).single();
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) return failure(describeDbError(error, t, "deleteFailed"));
  await deleteFile((row as unknown as Record<string, string | null> | null)?.[photoColumn]);

  revalidate();
  return success(t("deleted"));
}
