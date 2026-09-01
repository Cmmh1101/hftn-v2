"use client";

import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import type { AppLocale } from "@/i18n/routing";

const LOCALES: { code: AppLocale; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
];

export function LocaleSwitcher({ onDark = false }: { onDark?: boolean }) {
  const locale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  function switchTo(next: AppLocale) {
    router.replace({ pathname, query: Object.fromEntries(searchParams.entries()) }, { locale: next });
  }

  return (
    <div className="flex items-center gap-0.5 text-xs font-bold">
      {LOCALES.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => switchTo(l.code)}
          aria-current={locale === l.code}
          className={cn(
            "rounded px-2 py-1",
            locale === l.code
              ? onDark
                ? "bg-accent-strong text-accent-ink"
                : "bg-ink text-white"
              : onDark
                ? "text-sidebar-inactive hover:text-white"
                : "text-ink-soft hover:text-ink",
          )}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
