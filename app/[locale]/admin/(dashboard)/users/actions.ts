"use server";

import { revalidatePath } from "next/cache";
import { getLocale, getTranslations } from "next-intl/server";
import { describeDbError, failure, success, type ActionResult } from "@/lib/action-result";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { ProfileRole } from "@/lib/types";

function revalidateUsers() {
  revalidatePath("/en/admin/users");
  revalidatePath("/es/admin/users");
}

/** True when the person making this request is signed in as an admin. */
async function isCurrentUserAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  return data?.role === "admin";
}

export async function inviteUser(formData: FormData): Promise<ActionResult> {
  const t = await getTranslations("feedback");
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return failure(t("requiredFields"));
  // The invite uses the service-role key, which skips row-level security, so
  // the role check has to happen here.
  if (!(await isCurrentUserAdmin())) return failure(t("noPermission"));

  const locale = await getLocale();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3010";
  const supabase = createAdminClient();
  // The email's button lands on the "choose your password" screen.
  const { error } = await supabase.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${siteUrl}/${locale}/admin/reset-password`,
  });
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
