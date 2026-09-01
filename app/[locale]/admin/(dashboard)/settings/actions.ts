"use server";

import { revalidatePath } from "next/cache";
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

export async function updateSiteSettings(formData: FormData) {
  const supabase = await createClient();

  await supabase
    .from("site_settings")
    .update({
      countries_served: String(formData.get("countries_served") ?? "").trim(),
      jornadas_completed: String(formData.get("jornadas_completed") ?? "").trim(),
      scholarships_stat: String(formData.get("scholarships_stat") ?? "").trim(),
      families_reached: String(formData.get("families_reached") ?? "").trim(),
      total_deployed: String(formData.get("total_deployed") ?? "").trim(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", true);

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

  revalidateSettings();
}
