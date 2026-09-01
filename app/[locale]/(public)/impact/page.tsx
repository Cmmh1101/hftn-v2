import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/Card";
import { StatTile } from "@/components/ui/StatTile";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { PageIntro } from "@/components/site/PageIntro";
import { getSiteSettings } from "@/lib/queries";
import { getPublicUrl } from "@/lib/storage";

export default async function ImpactPage() {
  const [t, tRegions, settings] = await Promise.all([
    getTranslations("impact"),
    getTranslations("regions"),
    getSiteSettings(),
  ]);

  const IMPACT_STATS = [
    { value: settings.countries_served, label: t("statCountries") },
    { value: settings.jornadas_completed, label: t("statJornadas") },
    { value: settings.scholarships_stat, label: t("statStudents") },
    { value: settings.total_deployed, label: t("statDeployed") },
  ];

  const REGION_REACH = [
    { label: tRegions("southAmerica"), pct: 78, families: 6200 },
    { label: tRegions("northAmerica"), pct: 22, families: 900 },
  ];

  const REPORTS = [
    { label: t("annualReport"), url: getPublicUrl(settings.annual_report_path) },
    { label: t("form990"), url: getPublicUrl(settings.form_990_path) },
    { label: t("letter501c3"), url: getPublicUrl(settings.letter_501c3_path) },
  ];

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
      <div className="mb-11 grid grid-cols-1 gap-4 sm:grid-cols-2">
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
          <Card key={r.label} className="flex items-center justify-between">
            <span className="text-sm font-semibold">{r.label}</span>
            {r.url ? (
              <a href={r.url} target="_blank" rel="noreferrer" className="text-xs font-bold text-blue">
                {t("pdf")}
              </a>
            ) : (
              <span className="text-xs italic text-label">{t("comingSoon")}</span>
            )}
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
