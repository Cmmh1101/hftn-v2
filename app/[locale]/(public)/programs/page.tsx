import { getTranslations, getLocale } from "next-intl/server";
import { Card } from "@/components/ui/Card";
import { Photo } from "@/components/ui/Photo";
import { PageIntro } from "@/components/site/PageIntro";
import { JornadaTypesSection } from "@/components/site/JornadaTypesSection";
import { ProgramCard } from "@/components/site/ProgramCard";
import { getPrograms } from "@/lib/queries";
import { PROGRAM_TYPES } from "@/lib/programTypes";
import { PROGRAM_REGIONS } from "@/lib/regions";
import { formatEventDateLong, toIntlLocale } from "@/lib/format";

export default async function ProgramsPage() {
  const [t, tCategory, tTypes, tRegions, locale, programs] = await Promise.all([
    getTranslations("programs"),
    getTranslations("programCategory"),
    getTranslations("programTypes"),
    getTranslations("regions"),
    getLocale(),
    getPrograms(),
  ]);
  const intlLocale = toIntlLocale(locale);

  const flagship = programs.find((p) => p.category === "flagship");
  // Only ongoing ministries belong in this overview grid — a completed
  // historical jornada (e.g. a past disaster response) shouldn't show up
  // next to the general "Disaster Relief" program card.
  const continuousAndRelief = programs.filter(
    (p) => (p.category === "continuous" || p.category === "relief") && p.status === "Active",
  );

  const jornadaPrograms = programs.filter((p) => p.category === "jornada");
  const regionLabel = (region: string) => tRegions(PROGRAM_REGIONS.find((r) => r.dbValue === region)?.labelKey ?? "southAmerica");
  const typeLabel = (type: string) => tTypes(PROGRAM_TYPES.find((pt) => pt.dbValue === type)?.labelKey ?? "continuous");
  // Only types with at least one real jornada record show up — no empty
  // cards for outreach types that haven't happened yet.
  const jornadaGroups = PROGRAM_TYPES.map((pt) => ({
    type: pt.dbValue,
    label: tTypes(pt.labelKey),
    entries: jornadaPrograms
      .filter((p) => p.type === pt.dbValue)
      .map((p) => ({
        id: p.id,
        name: p.name,
        dateLabel: p.program_date ? formatEventDateLong(p.program_date, intlLocale) : "",
        regionLabel: p.region ? regionLabel(p.region) : "",
        summary: p.summary,
        photo_path: p.photo_path,
      })),
  })).filter((g) => g.entries.length > 0);

  return (
    <main className="mx-auto max-w-[1240px] px-8 pb-20 pt-14">
      <PageIntro eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />

      {flagship ? (
        <Card highlight className="mb-5 grid grid-cols-1 items-center gap-8 md:grid-cols-2">
          <div>
            <span className="text-xs font-bold tracking-wide text-accent-deep">
              {tCategory("flagship").toUpperCase()} · {typeLabel(flagship.type).toUpperCase()}
            </span>
            <h2 className="mt-2.5 font-serif text-[26px] font-semibold">{flagship.name}</h2>
            <p className="mt-3 text-[14.5px] leading-relaxed text-muted">{flagship.summary}</p>
            {flagship.website_url ? (
              <a
                href={flagship.website_url}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-sm font-bold text-blue hover:text-blue-hover"
              >
                {t("visitWebsite")} →
              </a>
            ) : null}
          </div>
          <Photo path={flagship.photo_path} alt={flagship.name} tone="warm" aspect="16/9" label="PHOTO — online classroom" />
        </Card>
      ) : null}

      <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-3">
        {continuousAndRelief.map((p) => (
          <ProgramCard
            key={p.id}
            program={{
              id: p.id,
              name: p.name,
              categoryLabel: tCategory(p.category),
              typeLabel: typeLabel(p.type),
              regionLabel: regionLabel(p.region),
              participants: p.participants,
              summary: p.summary,
              photo_path: p.photo_path,
              websiteUrl: p.website_url,
            }}
            regionFieldLabel={t("fieldRegion")}
            participantsFieldLabel={t("fieldParticipants")}
            visitWebsiteLabel={t("visitWebsite")}
          />
        ))}
      </div>

      {jornadaGroups.length > 0 ? (
        <>
          <h2 className="mb-2 mt-11 font-serif text-2xl font-semibold">{t("jornadasTitle")}</h2>
          <p className="mb-5 max-w-[640px] text-[14.5px] leading-relaxed text-muted">{t("jornadasIntro")}</p>
          <JornadaTypesSection groups={jornadaGroups} />
        </>
      ) : null}
    </main>
  );
}
