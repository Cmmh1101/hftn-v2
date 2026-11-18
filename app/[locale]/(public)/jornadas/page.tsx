import { ArrowRight } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { PageIntro } from "@/components/site/PageIntro";
import { JornadaTypesSection } from "@/components/site/JornadaTypesSection";
import { getGalleryGroups, getPrograms } from "@/lib/queries";
import { PROGRAM_TYPES } from "@/lib/programTypes";
import { GALLERY_REGIONS, PROGRAM_REGIONS } from "@/lib/regions";
import { formatEventDateLong, toIntlLocale } from "@/lib/format";
import { slugify } from "@/lib/slug";

export default async function JornadasPage() {
  const [t, tTypes, tRegions, locale, programs, galleryGroups] = await Promise.all([
    getTranslations("jornadas"),
    getTranslations("programTypes"),
    getTranslations("regions"),
    getLocale(),
    getPrograms(),
    getGalleryGroups(),
  ]);
  const intlLocale = toIntlLocale(locale);

  const regionLabel = (region: string) =>
    tRegions(PROGRAM_REGIONS.find((r) => r.dbValue === region)?.labelKey ?? "southAmerica");
  const galleryRegionLabel = (region: string) => {
    const match = GALLERY_REGIONS.find((r) => r.dbValue === region);
    return match ? tRegions(match.labelKey) : region;
  };

  // Only service types with at least one real jornada record get a card — no
  // empty cards for outreach types that haven't happened yet.
  const jornadaPrograms = programs.filter((p) => p.category === "jornada");
  const typeGroups = PROGRAM_TYPES.map((pt) => ({
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

      {galleryGroups.length > 0 ? (
        <section aria-labelledby="recent-jornadas" className="mb-14">
          <h2 id="recent-jornadas" className="font-serif text-2xl font-semibold">
            {t("recentTitle")}
          </h2>
          <p className="mb-6 mt-2 max-w-[640px] text-[14.5px] leading-relaxed text-muted">{t("recentIntro")}</p>
          <ul role="list" className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {galleryGroups.map((g, i) => (
              <li key={g.location}>
                <Reveal delay={(i % 3) * 90} className="h-full">
                  <Link href={`/gallery#${slugify(g.location)}`} className="block h-full">
                    <Card padding="none" className="card-lift h-full overflow-hidden">
                      <Photo
                        path={g.photos[0]?.storage_path}
                        alt=""
                        aspect="4/3"
                        label={g.location}
                        rounded="0"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                      />
                      <div className="p-5">
                        <span className="text-[11px] font-bold tracking-wide text-blue">
                          {galleryRegionLabel(g.region).toUpperCase()}
                        </span>
                        <h3 className="mt-1.5 font-serif text-[19px] font-semibold">{g.location}</h3>
                        {g.caption ? (
                          <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{g.caption}</p>
                        ) : null}
                        <span className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-blue">
                          {g.photos.length > 0 ? t("photosCount", { count: g.photos.length }) : t("viewPhotos")}
                          <ArrowRight aria-hidden className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </Card>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {typeGroups.length > 0 ? (
        <section aria-labelledby="jornada-types" className="mb-14">
          <h2 id="jornada-types" className="font-serif text-2xl font-semibold">
            {t("typesTitle")}
          </h2>
          <p className="mb-5 mt-2 max-w-[640px] text-[14.5px] leading-relaxed text-muted">{t("typesIntro")}</p>
          <JornadaTypesSection groups={typeGroups} />
        </section>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-6 rounded-lg bg-gradient-to-br from-ink-soft via-ink to-ink-dark p-9 shadow-[0_4px_20px_rgba(1,19,50,0.25)]">
        <div>
          <h2 className="font-serif text-[22px] font-semibold text-white">{t("ctaTitle")}</h2>
          <p className="mt-1.5 text-sm text-white/80">{t("ctaBody")}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button href="/donate" variant="accentOnDark">
            {t("ctaDonate")}
          </Button>
          <Button href="/events" variant="outlineOnDark">
            {t("ctaEvents")}
          </Button>
        </div>
      </div>
    </main>
  );
}
