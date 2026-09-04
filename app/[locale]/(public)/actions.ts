"use server";

import { getTranslations } from "next-intl/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { subscribeToAudience } from "@/lib/resend";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export type NewsletterFormState = { status: "idle" | "success" | "error"; message?: string };

export async function subscribeNewsletter(
  _prevState: NewsletterFormState,
  formData: FormData,
): Promise<NewsletterFormState> {
  const t = await getTranslations("footer");
  const email = String(formData.get("email") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();

  if (!email) {
    return { status: "error", message: t("newsletterErrorFields") };
  }

  const ip = await getClientIp();
  const allowed = await checkRateLimit(`newsletter:${ip}`, 5, 60);
  if (!allowed) {
    return { status: "error", message: t("newsletterErrorRateLimit") };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("subscribers").insert({ email, name });

  if (error) {
    if (error.code === "23505") {
      return { status: "error", message: t("newsletterDuplicate") };
    }
    return { status: "error", message: t("newsletterErrorGeneric") };
  }

  const resendContactId = await subscribeToAudience({ email, name });
  if (resendContactId) {
    await supabase.from("subscribers").update({ resend_contact_id: resendContactId }).eq("email", email);
  }

  return { status: "success", message: t("newsletterSuccess") };
}
