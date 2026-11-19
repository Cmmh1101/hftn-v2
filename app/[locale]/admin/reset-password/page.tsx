"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { AdminAuthCard } from "@/components/site/AdminAuthCard";
import { Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useToast } from "@/components/ui/Toast";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth-rules";
import { createClient } from "@/lib/supabase/client";

type Status = "checking" | "ready" | "invalid";

// Landing page for both the "reset my password" email and the invitation email:
// the link signs the person in temporarily, and this screen lets them choose a
// password. Without a valid link there is nothing to do here.
export default function ResetPasswordPage() {
  const t = useTranslations("admin.auth");
  const tLogin = useTranslations("admin.login");
  const tFeedback = useTranslations("feedback");
  const toast = useToast();
  const router = useRouter();
  const [status, setStatus] = useState<Status>("checking");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();
    (async () => {
      // getSession() waits for the client to finish reading the link's code or
      // token out of the address bar.
      let { data } = await supabase.auth.getSession();
      if (!data.session) {
        // Older-style links carry the tokens in the #fragment.
        const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
        const access_token = hash.get("access_token");
        const refresh_token = hash.get("refresh_token");
        if (access_token && refresh_token) {
          await supabase.auth.setSession({ access_token, refresh_token });
          data = (await supabase.auth.getSession()).data;
        }
      }
      if (!cancelled) setStatus(data.session ? "ready" : "invalid");
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < MIN_PASSWORD_LENGTH) {
      toast.error(t("passwordTooShort", { min: MIN_PASSWORD_LENGTH }));
      return;
    }
    if (password !== confirm) {
      toast.error(t("passwordMismatch"));
      return;
    }
    setLoading(true);
    try {
      const { error } = await createClient().auth.updateUser({ password });
      if (error) {
        toast.error(t("resetFailed"));
        setLoading(false);
        return;
      }
    } catch {
      toast.error(tFeedback("networkError"));
      setLoading(false);
      return;
    }
    toast.success(t("passwordUpdated"));
    router.push("/admin");
    router.refresh();
  }

  return (
    <AdminAuthCard tagline={tLogin("tagline")}>
      <h1 className="mb-2 font-serif text-xl font-semibold">{t("resetTitle")}</h1>
      {status === "checking" ? (
        <div role="status" className="flex items-center gap-2 text-[15px] text-muted">
          <Spinner />
          {t("checkingLink")}
        </div>
      ) : null}
      {status === "invalid" ? (
        <>
          <p role="alert" className="text-[15px] leading-relaxed text-muted">
            {t("linkInvalid")}
          </p>
          <Button href="/admin/forgot-password" variant="primary" className="mt-5 w-full justify-center">
            {t("requestNew")}
          </Button>
        </>
      ) : null}
      {status === "ready" ? (
        <form onSubmit={handleSubmit} aria-busy={loading}>
          <p className="mb-5 text-[15px] leading-relaxed text-muted">{t("resetIntro", { min: MIN_PASSWORD_LENGTH })}</p>
          <div className="flex flex-col gap-3.5">
            <Input
              type="password"
              placeholder={t("newPassword")}
              aria-label={t("newPassword")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={MIN_PASSWORD_LENGTH}
              autoFocus
              autoComplete="new-password"
            />
            <Input
              type="password"
              placeholder={t("confirmPassword")}
              aria-label={t("confirmPassword")}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          <Button type="submit" variant="primary" className="mt-5 w-full justify-center" disabled={loading}>
            {loading ? (
              <>
                <Spinner />
                {tFeedback("saving")}
              </>
            ) : (
              t("savePassword")
            )}
          </Button>
        </form>
      ) : null}
      {status !== "ready" ? (
        <div className="mt-5 text-center">
          <Link href="/admin/login" className="inline-flex min-h-11 items-center text-[14px] font-bold">
            {t("backToLogin")}
          </Link>
        </div>
      ) : null}
    </AdminAuthCard>
  );
}
