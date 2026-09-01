"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const t = useTranslations("admin.login");
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
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-soft-2 px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border border-border bg-surface p-8"
      >
        <div className="mb-1 font-serif text-lg font-bold">
          Hope <span className="text-accent">Admin</span>
        </div>
        <div className="mb-7 text-xs tracking-wide text-label">{t("tagline")}</div>

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

        {error ? <p className="mt-3 text-xs text-red-600">{error}</p> : null}

        <Button type="submit" variant="primary" className="mt-5 w-full justify-center" disabled={loading}>
          {loading ? t("signingIn") : t("signIn")}
        </Button>
      </form>
    </main>
  );
}
