"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export async function inviteUser(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return;

  const supabase = createAdminClient();
  await supabase.auth.admin.inviteUserByEmail(email);
  revalidatePath("/en/admin/users");
  revalidatePath("/es/admin/users");
}
