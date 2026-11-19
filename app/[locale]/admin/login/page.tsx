"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useToast } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const t = useTranslations("admin.login");
  const tFeedback = useTranslations("feedback");
  const toast = useToast();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        // Supabase's wording is English-only; show our own translated message.
        const message = signInError.status === 400 ? tFeedback("invalidLogin") : tFeedback("errorGeneric");
        setError(message);
        toast.error(message);
        setLoading(false);
        return;
      }
    } catch {
      const message = tFeedback("networkError");
      setError(message);
      toast.error(message);
      setLoading(false);
      return;
    }
    // Keep the spinner up until the dashboard has actually loaded.
    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-soft-2 px-6">
      <form
        onSubmit={handleSubmit}
        aria-busy={loading}
        className="w-full max-w-sm rounded-lg border border-border bg-surface p-8"
      >
        <Image src="/brand/logo.png" alt="" width={212} height={180} priority className="mb-3 h-14 w-auto" />
        <div className="mb-1 font-serif text-lg font-bold">
          Hope <span className="text-accent">Admin</span>
        </div>
        <div className="mb-7 text-[13px] tracking-wide text-label">{t("tagline")}</div>

        <div className="flex flex-col gap-3.5">
          <Input
            type="email"
            placeholder={t("emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
          <Input
            type="password"
            placeholder={t("passwordPlaceholder")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error ? (
          <p role="alert" className="mt-3 text-[14px] font-semibold text-red-700">
            {error}
          </p>
        ) : null}

        <Button type="submit" variant="primary" className="mt-5 w-full justify-center" disabled={loading}>
          {loading ? (
            <>
              <Spinner />
              {t("signingIn")}
            </>
          ) : (
            t("signIn")
          )}
        </Button>
      </form>
    </main>
  );
}
