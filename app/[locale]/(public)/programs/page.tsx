import { ArrowRight } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Photo } from "@/components/ui/Photo";
import { PageIntro } from "@/components/site/PageIntro";
import { ProgramCard, ProgramMoreButton, type ProgramCardData } from "@/components/site/ProgramModal";
import { getPrograms, getProgramPhotosByProgram } from "@/lib/queries";
import { PROGRAM_TYPES } from "@/lib/programTypes";
import { PROGRAM_REGIONS } from "@/lib/regions";

export default async function ProgramsPage() {
  const contentLocale = await getLocale();
  const [t, tCategory, tTypes, tRegions, programs, photosByProgram] = await Promise.all([
    getTranslations("programs"),
    getTranslations("programCategory"),
    getTranslations("programTypes"),
    getTranslations("regions"),
    getPrograms(contentLocale),
    getProgramPhotosByProgram(contentLocale),
  ]);

  const flagship = programs.find((p) => p.category === "flagship");
  // Only ongoing ministries belong in this overview grid — a completed
  // historical jornada (e.g. a past disaster response) shouldn't show up
  // next to the general "Disaster Relief" program card.
  const continuousAndRelief = programs.filter(
    (p) => (p.category === "continuous" || p.category === "relief") && p.status === "Active",
  );

  const regionLabel = (region: string) => tRegions(PROGRAM_REGIONS.find((r) => r.dbValue === region)?.labelKey ?? "southAmerica");
  const typeLabel = (type: string) => tTypes(PROGRAM_TYPES.find((pt) => pt.dbValue === type)?.labelKey ?? "continuous");

  const toCardData = (p: (typeof programs)[number]): ProgramCardData => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    categoryLabel: tCategory(p.category),
    typeLabel: typeLabel(p.type),
    regionLabel: regionLabel(p.region),
    participants: p.participants,
    summary: p.summary,
    photo_path: p.photo_path,
    photos: (photosByProgram.get(p.id) ?? []).map((photo) => photo.storage_path),
    websiteUrl: p.website_url,
  });

  const flagshipData = flagship ? toCardData(flagship) : null;
  const flagshipCover = flagshipData ? (flagshipData.photo_path ?? flagshipData.photos[0] ?? null) : null;

  return (
    <main className="mx-auto max-w-[1240px] px-5 sm:px-8 pb-16 sm:pb-20 pt-10 sm:pt-14">
      <PageIntro eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />

      {flagship && flagshipData ? (
        <Card highlight className="mb-5 grid grid-cols-1 items-center gap-8 md:grid-cols-2">
          <div>
            <span className="text-[13px] font-bold tracking-wide text-accent-deep">
              {tCategory("flagship").toUpperCase()} · {typeLabel(flagship.type).toUpperCase()}
            </span>
            <h2 className="mt-2.5 font-serif text-[26px] font-semibold">{flagship.name}</h2>
            <p className="mt-3 text-base leading-relaxed lg:text-[17px] text-muted">{flagship.summary}</p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <ProgramMoreButton program={flagshipData}>{t("seeMore")}</ProgramMoreButton>
              {flagship.website_url ? (
                <Button href={flagship.website_url} target="_blank" rel="noreferrer" variant="outline">
                  {t("visitWebsite")}
                  <ArrowRight aria-hidden className="h-4 w-4" />
                </Button>
              ) : null}
            </div>
          </div>
          <Photo path={flagshipCover} alt={flagship.name} tone="warm" aspect="16/9" label="PHOTO — online classroom" />
        </Card>
      ) : null}

      <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {continuousAndRelief.map((p) => (
          <ProgramCard key={p.id} program={toCardData(p)} />
        ))}
      </div>

      <Card padding="lg" className="card-lift mt-11 flex flex-wrap items-center justify-between gap-6">
        <div className="max-w-[640px]">
          <h2 className="font-serif text-2xl font-semibold">{t("jornadasTitle")}</h2>
          <p className="mt-2 text-base leading-relaxed lg:text-[17px] text-muted">{t("jornadasIntro")}</p>
        </div>
        <Button href="/jornadas" variant="primary">
          {t("jornadasCta")}
          <ArrowRight aria-hidden className="h-4 w-4" />
        </Button>
      </Card>
    </main>
  );
}
