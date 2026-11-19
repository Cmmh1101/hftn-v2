import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Photo } from "@/components/ui/Photo";
import { PhotoLightbox } from "@/components/ui/PhotoLightbox";
import { ProseText } from "@/components/ui/ProseText";
import { VideoEmbed } from "@/components/ui/VideoEmbed";
import { getPrograms, getProgramBySlug, getProgramPhotos } from "@/lib/queries";
import { getPublicUrl } from "@/lib/storage";
import { PROGRAM_TYPES } from "@/lib/programTypes";
import { PROGRAM_REGIONS } from "@/lib/regions";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const program = await getProgramBySlug(slug, locale);
  if (!program) return {};
  const cover = getPublicUrl(program.photo_path);
  return {
    title: program.name,
    description: program.summary,
    openGraph: { title: program.name, description: program.summary, images: cover ? [cover] : undefined },
  };
}

export default async function ProgramDetailPage({ params }: Params) {
  const { slug } = await params;
  const locale = await getLocale();
  const [t, tCategory, tTypes, tRegions, tStatus, program, allPrograms] = await Promise.all([
    getTranslations("programs"),
    getTranslations("programCategory"),
    getTranslations("programTypes"),
    getTranslations("regions"),
    getTranslations("status"),
    getProgramBySlug(slug, locale),
    getPrograms(locale),
  ]);

  if (!program) notFound();

  const photos = await getProgramPhotos(program.id, locale);
  const cover = program.photo_path ?? photos[0]?.storage_path ?? null;
  const typeLabel = tTypes(PROGRAM_TYPES.find((pt) => pt.dbValue === program.type)?.labelKey ?? "continuous");
  const regionLabel = tRegions(PROGRAM_REGIONS.find((r) => r.dbValue === program.region)?.labelKey ?? "southAmerica");
  const others = allPrograms.filter((p) => p.id !== program.id && p.slug && p.status === "Active").slice(0, 3);

  return (
    <main className="mx-auto max-w-[1240px] px-5 sm:px-8 pb-16 sm:pb-20 pt-10 sm:pt-14">
      <Link href="/programs" className="text-[15px] font-semibold text-blue">
        ← {t("backToPrograms")}
      </Link>

      <header className="mt-6 max-w-[820px]">
        <span className="text-[13px] font-bold uppercase tracking-[2px] text-blue">
          {tCategory(program.category)} · {typeLabel}
        </span>
        <h1 className="mt-3 font-serif text-[34px] font-semibold leading-tight sm:text-[44px]">{program.name}</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted lg:text-xl">{program.summary}</p>
      </header>

      {cover ? (
        <Photo
          path={cover}
          alt={program.name}
          aspect="21/9"
          rounded="14px"
          className="mt-8 max-md:aspect-[4/3]!"
          sizes="(max-width: 1240px) 100vw, 1240px"
          priority
        />
      ) : null}

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0">
          {program.description ? (
            <ProseText text={program.description} />
          ) : (
            <p className="text-base leading-relaxed text-muted lg:text-[17px]">{program.summary}</p>
          )}
        </div>

        <aside className="flex flex-col gap-5">
          <Card>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-4 text-[15px]">
              <div>
                <dt className="text-[12.5px] font-bold tracking-wide text-label">{t("fieldRegion").toUpperCase()}</dt>
                <dd className="mt-1 font-semibold text-ink">{regionLabel}</dd>
              </div>
              <div>
                <dt className="text-[12.5px] font-bold tracking-wide text-label">{t("fieldStatus").toUpperCase()}</dt>
                <dd className="mt-1 font-semibold text-ink">{tStatus(program.status)}</dd>
              </div>
              {program.participants > 0 ? (
                <div className="col-span-2">
                  <dt className="text-[12.5px] font-bold tracking-wide text-label">{t("fieldParticipants").toUpperCase()}</dt>
                  <dd className="mt-1 font-serif text-2xl font-semibold text-ink">{program.participants.toLocaleString()}</dd>
                </div>
              ) : null}
            </dl>
            <div className="mt-6 flex flex-col gap-3">
              <Button href="/donate" variant="primary">
                {t("supportProgram")}
              </Button>
              {program.website_url ? (
                <Button href={program.website_url} target="_blank" rel="noreferrer" variant="outline">
                  {t("visitWebsite")}
                  <ArrowRight aria-hidden className="h-4 w-4" />
                </Button>
              ) : null}
            </div>
          </Card>
        </aside>
      </div>

      {program.video_url ? (
        <section aria-labelledby="program-video" className="mt-14">
          <h2 id="program-video" className="mb-5 font-serif text-[26px] font-semibold">
            {t("videoTitle")}
          </h2>
          <VideoEmbed url={program.video_url} title={program.name} className="max-w-[920px]" />
        </section>
      ) : null}

      {photos.length > 0 ? (
        <section aria-labelledby="program-photos" className="mt-14">
          <h2 id="program-photos" className="mb-5 font-serif text-[26px] font-semibold">
            {t("photosTitle")}
          </h2>
          <PhotoLightbox
            photos={photos.map((p) => ({ path: p.storage_path, alt: p.caption || program.name, caption: p.caption }))}
          />
        </section>
      ) : null}

      {others.length > 0 ? (
        <section aria-labelledby="more-programs" className="mt-16 border-t border-border pt-11">
          <h2 id="more-programs" className="mb-5 font-serif text-[26px] font-semibold">
            {t("moreProgramsTitle")}
          </h2>
          <ul role="list" className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {others.map((p) => (
              <li key={p.id}>
                <Link href={`/programs/${p.slug}`} className="block h-full">
                  <Card padding="none" className="card-lift h-full overflow-hidden">
                    <Photo path={p.photo_path} alt={p.name} aspect="4/3" label={`PHOTO — ${p.name}`} rounded="0" />
                    <div className="p-5">
                      <span className="text-[12.5px] font-bold tracking-wide text-blue">{tCategory(p.category).toUpperCase()}</span>
                      <h3 className="mt-2 font-serif text-[19px] text-ink">{p.name}</h3>
                    </div>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
