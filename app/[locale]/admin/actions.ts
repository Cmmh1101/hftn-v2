"use server";

import { createClient } from "@/lib/supabase/server";
import { success, type ActionResult } from "@/lib/action-result";

export async function signOut(): Promise<ActionResult> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return success(undefined, "/admin/login");
}
