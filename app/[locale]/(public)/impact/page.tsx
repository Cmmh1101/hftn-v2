import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/Card";
import { StatTile } from "@/components/ui/StatTile";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { PageIntro } from "@/components/site/PageIntro";

export default async function ImpactPage() {
  const [t, tRegions] = await Promise.all([getTranslations("impact"), getTranslations("regions")]);

  const IMPACT_STATS = [
    { value: "14", label: t("statCountries") },
    { value: "312", label: t("statJornadas") },
    { value: "1,860", label: t("statStudents") },
    { value: "$1.4M", label: t("statDeployed") },
  ];

  const REGION_REACH = [
    { label: tRegions("southAmerica"), pct: 78, families: 6200 },
    { label: tRegions("centralAmerica"), pct: 38, families: 2100 },
    { label: tRegions("northAmerica"), pct: 22, families: 900 },
    { label: tRegions("europe"), pct: 12, families: 200 },
  ];

  const REPORTS = [t("annualReport"), t("form990"), t("letter501c3")];

  return (
    <main className="mx-auto max-w-[1240px] px-8 pb-20 pt-14">
      <PageIntro eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />

      <div className="mb-11 grid grid-cols-2 gap-5 md:grid-cols-4">
        {IMPACT_STATS.map((s) => (
          <Card key={s.label}>
            <StatTile value={s.value} label={s.label} tone="accent" />
          </Card>
        ))}
      </div>

      <h2 className="mb-5 font-serif text-2xl font-semibold">{t("reachByRegion")}</h2>
      <div className="mb-11 grid grid-cols-2 gap-4 md:grid-cols-4">
        {REGION_REACH.map((r) => (
          <Card key={r.label}>
            <div className="mb-2.5 text-xs font-bold text-blue">{r.label.toUpperCase()}</div>
            <ProgressBar percent={r.pct} color="accent" />
            <div className="mt-2 text-xs text-muted-2">{t("families", { count: r.families.toLocaleString() })}</div>
          </Card>
        ))}
      </div>

      <h2 className="mb-5 font-serif text-2xl font-semibold">{t("reportsTitle")}</h2>
      <div className="mb-11 grid grid-cols-1 gap-4 md:grid-cols-3">
        {REPORTS.map((r) => (
          <Card key={r} className="flex items-center justify-between">
            <span className="text-sm font-semibold">{r}</span>
            <span className="text-xs font-bold text-blue">{t("pdf")}</span>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-6 rounded-lg bg-ink p-9">
        <div>
          <div className="font-serif text-[22px] font-semibold text-white">{t("ctaTitle")}</div>
          <div className="mt-1.5 text-sm text-white/80">{t("ctaBody")}</div>
        </div>
        <Button href="/contact" variant="accentOnDark">
          {t("talkToTeam")}
        </Button>
      </div>
    </main>
  );
}
