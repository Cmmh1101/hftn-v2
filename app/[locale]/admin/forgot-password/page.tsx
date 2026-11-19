"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { AdminAuthCard } from "@/components/site/AdminAuthCard";
import { Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useToast } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const t = useTranslations("admin.auth");
  const tLogin = useTranslations("admin.login");
  const tFeedback = useTranslations("feedback");
  const toast = useToast();
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await createClient().auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/${locale}/admin/reset-password`,
      });
      if (error?.status === 429) {
        toast.error(t("tooManyRequests"));
        setLoading(false);
        return;
      }
      // Same answer whether or not the address has an account, so this screen
      // can't be used to find out who is registered.
      setSent(true);
    } catch {
      toast.error(tFeedback("networkError"));
    }
    setLoading(false);
  }

  return (
    <AdminAuthCard tagline={tLogin("tagline")}>
      <h1 className="mb-2 font-serif text-xl font-semibold">{t("forgotTitle")}</h1>
      {sent ? (
        <div role="status" className="text-[15px] leading-relaxed text-muted">
          {t("linkSent")}
        </div>
      ) : (
        <form onSubmit={handleSubmit} aria-busy={loading}>
          <p className="mb-5 text-[15px] leading-relaxed text-muted">{t("forgotIntro")}</p>
          <Input
            type="email"
            placeholder={tLogin("emailPlaceholder")}
            aria-label={tLogin("emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
            autoComplete="email"
            className="w-full"
          />
          <Button type="submit" variant="primary" className="mt-5 w-full justify-center" disabled={loading}>
            {loading ? (
              <>
                <Spinner />
                {tFeedback("sending")}
              </>
            ) : (
              t("sendLink")
            )}
          </Button>
        </form>
      )}
      <div className="mt-5 text-center">
        <Link href="/admin/login" className="inline-flex min-h-11 items-center text-[14px] font-bold">
          {t("backToLogin")}
        </Link>
      </div>
    </AdminAuthCard>
  );
}
