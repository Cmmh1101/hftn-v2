"use server";

import { getTranslations } from "next-intl/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendContactConfirmation, sendContactNotification } from "@/lib/resend";
import { syncToSheet } from "@/lib/sheets";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export type ContactFormState = { status: "idle" | "success" | "error"; message?: string };

export async function submitContact(_prevState: ContactFormState, formData: FormData): Promise<ContactFormState> {
  const t = await getTranslations("contact");
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { status: "error", message: t("errorFields") };
  }

  const ip = await getClientIp();
  const allowed = await checkRateLimit(`contact:${ip}`, 5, 15);
  if (!allowed) {
    return { status: "error", message: t("errorRateLimit") };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("contact_messages").insert({ name, email, message });
  if (error) {
    return { status: "error", message: t("errorGeneric") };
  }

  await Promise.all([
    sendContactNotification({ name, email, message }),
    sendContactConfirmation({ name, email }),
    syncToSheet({ type: "contact", name, email, message, createdAt: new Date().toISOString() }),
  ]);

  return { status: "success", message: t("success") };
}
