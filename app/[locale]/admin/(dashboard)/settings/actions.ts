"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { describeDbError, failure, success, type ActionResult } from "@/lib/action-result";
import { createClient } from "@/lib/supabase/server";
import { uploadFile, deleteFile } from "@/lib/storage";

const REPORTS = ["annual_report", "form_990", "letter_501c3"] as const;

function revalidateSettings() {
  for (const locale of ["en", "es"]) {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/impact`);
    revalidatePath(`/${locale}/admin/settings`);
  }
}

export async function updateSiteSettings(formData: FormData): Promise<ActionResult> {
  const t = await getTranslations("feedback");
  const supabase = await createClient();

  const { error: statsError } = await supabase
    .from("site_settings")
    .update({
      countries_served: String(formData.get("countries_served") ?? "").trim(),
      jornadas_completed: String(formData.get("jornadas_completed") ?? "").trim(),
      scholarships_stat: String(formData.get("scholarships_stat") ?? "").trim(),
      families_reached: String(formData.get("families_reached") ?? "").trim(),
      total_deployed: String(formData.get("total_deployed") ?? "").trim(),
      home_video_url: String(formData.get("home_video_url") ?? "").trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", true);
  if (statsError) return failure(describeDbError(statsError, t, "saveFailed"));

  try {
    await saveFiles(formData);
  } catch (e) {
    console.error("Settings file update failed:", e);
    revalidateSettings();
    return failure(t("uploadFailed"));
  }

  revalidateSettings();
  return success(t("settingsSaved"));
}

// Reports (PDFs) and the home-page photo; runs after the numbers are saved.
async function saveFiles(formData: FormData) {
  const supabase = await createClient();

  for (const key of REPORTS) {
    const pathColumn = `${key}_path`;
    const file = formData.get(`${key}_file`) as File | null;
    const remove = formData.get(`remove_${key}`) === "on";

    if (file && file.size > 0) {
      const path = await uploadFile(file, "reports", key);
      await supabase.from("site_settings").update({ [pathColumn]: path }).eq("id", true);
    } else if (remove) {
      const { data } = await supabase.from("site_settings").select(pathColumn).eq("id", true).single();
      const current = (data as Record<string, string | null> | null)?.[pathColumn];
      await deleteFile(current);
      await supabase.from("site_settings").update({ [pathColumn]: null }).eq("id", true);
    }
  }

  const heroFile = formData.get("hero_photo_file") as File | null;
  const removeHero = formData.get("remove_hero_photo") === "on";
  if ((heroFile && heroFile.size > 0) || removeHero) {
    const { data: current } = await supabase.from("site_settings").select("hero_photo_path").eq("id", true).single();
    if (heroFile && heroFile.size > 0) {
      // A fresh filename per upload: a reused path would keep serving the old
      // image from the image CDN's cache after a replacement.
      const path = await uploadFile(heroFile, "site", `hero-${Date.now()}`);
      await supabase.from("site_settings").update({ hero_photo_path: path }).eq("id", true);
    } else {
      await supabase.from("site_settings").update({ hero_photo_path: null }).eq("id", true);
    }
    await deleteFile(current?.hero_photo_path);
  }
}
