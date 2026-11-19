"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { describeDbError, failure, success, type ActionResult } from "@/lib/action-result";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { ProfileRole } from "@/lib/types";

function revalidateUsers() {
  revalidatePath("/en/admin/users");
  revalidatePath("/es/admin/users");
}

export async function inviteUser(formData: FormData): Promise<ActionResult> {
  const t = await getTranslations("feedback");
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return failure(t("requiredFields"));

  const supabase = createAdminClient();
  const { error } = await supabase.auth.admin.inviteUserByEmail(email);
  if (error) {
    console.error("Invite failed:", error.message);
    return failure(t("inviteFailed"));
  }

  revalidateUsers();
  return success(t("invited"));
}

export async function updateUserRole(id: string, formData: FormData): Promise<ActionResult> {
  const t = await getTranslations("feedback");
  const role = formData.get("role") as ProfileRole;
  if (!role) return failure(t("requiredFields"));

  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({ role }).eq("id", id);
  if (error) return failure(describeDbError(error, t, "saveFailed"));

  revalidateUsers();
  return success(t("roleUpdated"));
}
