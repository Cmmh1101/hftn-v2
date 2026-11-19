"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { cn } from "@/lib/cn";
import type { DonationKind, Program } from "@/lib/types";

const TIER_AMOUNTS = [2500, 6000, 15000] as const;
const SPONSORSHIP_CENTS = 15000;

function DesignationPill({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border border-border px-4.5 py-2.5 text-[15px] font-bold",
        selected ? "bg-ink text-white" : "bg-surface text-muted",
      )}
    >
      {children}
    </button>
  );
}

export function DonateForm({ programs }: { programs: Program[] }) {
  const t = useTranslations("donate");
  const locale = useLocale();

  const designationPrograms = useMemo(
    () => programs.filter((p) => ["flagship", "continuous", "relief"].includes(p.category)),
    [programs],
  );

  const tiers = [
    { amountCents: TIER_AMOUNTS[0], label: "$25", desc: t("tier25Desc") },
    { amountCents: TIER_AMOUNTS[1], label: "$60", desc: t("tier60Desc") },
    { amountCents: TIER_AMOUNTS[2], label: "$150", desc: t("tier150Desc") },
  ];

  const [tierIndex, setTierIndex] = useState<number | "custom">(2);
  const [customAmount, setCustomAmount] = useState("");
  const [programId, setProgramId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedProgram = programId ? designationPrograms.find((p) => p.id === programId) : null;
  const isSchoolOfHope = selectedProgram?.category === "flagship";

  const amountCents =
    tierIndex === "custom" ? Math.round(parseFloat(customAmount || "0") * 100) : tiers[tierIndex].amountCents;

  async function donate(kind: DonationKind) {
    setError(null);
    const finalAmountCents = kind === "sponsorship" ? SPONSORSHIP_CENTS : amountCents;
    if (!Number.isFinite(finalAmountCents) || finalAmountCents < 100) {
      setError(t("errorAmount"));
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountCents: finalAmountCents,
          kind,
          programId,
          programName: selectedProgram?.name ?? null,
          locale,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? t("errorGeneric"));
        setSubmitting(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError(t("errorGeneric"));
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="mb-9 grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 sm:gap-4 md:grid-cols-4">
        {tiers.map((tier, i) => (
          <Card
            key={tier.label}
            highlight={tierIndex === i}
            className="min-w-0 cursor-pointer p-3! text-center sm:p-6!"
            onClick={() => setTierIndex(i)}
          >
            <div className="font-serif text-xl font-bold sm:text-2xl">{tier.label}</div>
            <div className="mt-1.5 text-[13px] text-muted-2">{tier.desc}</div>
          </Card>
        ))}
        <Card
          highlight={tierIndex === "custom"}
          className="min-w-0 cursor-pointer p-3! text-center sm:p-6!"
          onClick={() => setTierIndex("custom")}
        >
          {tierIndex === "custom" ? (
            <Input
              type="number"
              min={1}
              placeholder={t("tierCustom")}
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="w-full min-w-0 text-center"
              autoFocus
            />
          ) : (
            <div className="font-serif text-xl font-bold sm:text-2xl">{t("tierCustom")}</div>
          )}
          <div className="mt-1.5 text-[13px] text-muted-2">{t("tierCustomDesc")}</div>
        </Card>
      </div>

      <div className="mb-8">
        <div className="mb-3 text-[13px] font-bold uppercase tracking-wide text-label">{t("giveTo")}</div>
        <div className="flex flex-wrap gap-2.5">
          <DesignationPill selected={programId === null} onClick={() => setProgramId(null)}>
            {t("whereverNeeded")}
          </DesignationPill>
          {designationPrograms.map((p) => (
            <DesignationPill key={p.id} selected={programId === p.id} onClick={() => setProgramId(p.id)}>
              {p.name}
            </DesignationPill>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3.5">
        <Button variant="accent" size="lg" className="max-sm:w-full" onClick={() => donate("one_time")} disabled={submitting}>
          {t("giveOnce")}
        </Button>
        <Button variant="outline" size="lg" className="max-sm:w-full" onClick={() => donate("monthly")} disabled={submitting}>
          {t("giveMonthly")}
        </Button>
        {isSchoolOfHope ? (
          <Button variant="outline" size="lg" className="max-sm:w-full" onClick={() => donate("sponsorship")} disabled={submitting}>
            {t("sponsorStudent")}
          </Button>
        ) : null}
      </div>
      {isSchoolOfHope ? <p className="mt-3 max-w-md text-[13px] text-label">{t("sponsorNote")}</p> : null}
      {error ? <p className="mt-3 text-[13px] text-red-600">{error}</p> : null}
    </div>
  );
}
