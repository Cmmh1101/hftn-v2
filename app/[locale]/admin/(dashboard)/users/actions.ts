"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { ProfileRole } from "@/lib/types";

function revalidateUsers() {
  revalidatePath("/en/admin/users");
  revalidatePath("/es/admin/users");
}

export async function inviteUser(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return;

  const supabase = createAdminClient();
  await supabase.auth.admin.inviteUserByEmail(email);
  revalidateUsers();
}

export async function updateUserRole(id: string, formData: FormData) {
  const role = formData.get("role") as ProfileRole;
  if (!role) return;

  const supabase = await createClient();
  await supabase.from("profiles").update({ role }).eq("id", id);
  revalidateUsers();
}
