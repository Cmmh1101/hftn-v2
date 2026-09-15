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

  // The message is already saved — a Resend/Sheets hiccup after this point
  // shouldn't turn into a crash for the visitor, so failures are logged
  // (visible in Netlify function logs) rather than thrown.
  const results = await Promise.allSettled([
    sendContactNotification({ name, email, message }),
    sendContactConfirmation({ name, email }),
    syncToSheet({ type: "contact", name, email, message, createdAt: new Date().toISOString() }),
  ]);
  for (const result of results) {
    if (result.status === "rejected") console.error("Contact form follow-up failed:", result.reason);
  }

  return { status: "success", message: t("success") };
}
