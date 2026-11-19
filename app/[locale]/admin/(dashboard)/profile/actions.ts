"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { describeDbError, failure, success, type ActionResult } from "@/lib/action-result";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth-rules";
import { createClient } from "@/lib/supabase/server";

export async function updateProfileName(formData: FormData): Promise<ActionResult> {
  const t = await getTranslations("feedback");
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return failure(t("requiredFields"));

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return failure(t("noPermission"));

  // Row-level security only lets people edit their own row; the role column is
  // protected by a database trigger.
  const { error } = await supabase.from("profiles").update({ name }).eq("id", user.id);
  if (error) return failure(describeDbError(error, t, "saveFailed"));

  revalidatePath("/", "layout");
  return success(t("saved"));
}

export async function changePassword(formData: FormData): Promise<ActionResult> {
  const t = await getTranslations("admin.auth");
  const tFeedback = await getTranslations("feedback");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (password.length < MIN_PASSWORD_LENGTH) return failure(t("passwordTooShort", { min: MIN_PASSWORD_LENGTH }));
  if (password !== confirm) return failure(t("passwordMismatch"));

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    console.error("Password change failed:", error.message);
    return failure(error.code === "same_password" ? t("samePassword") : tFeedback("saveFailed"));
  }
  return success(t("passwordUpdated"));
}
