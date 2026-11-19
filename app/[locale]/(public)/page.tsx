import { BookOpen, CalendarDays, ChartColumn, Compass, Images, Newspaper } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { VideoBadge } from "@/components/ui/VideoBadge";
import { SectionWave } from "@/components/ui/SectionWave";
import { StatTile } from "@/components/ui/StatTile";
import Image from "next/image";
import { Photo } from "@/components/ui/Photo";
import { VideoEmbed } from "@/components/ui/VideoEmbed";
import { SponsorsStrip } from "@/components/site/SponsorsStrip";
import { VerseBanner } from "@/components/site/VerseBanner";
import { getGalleryGroups, getNextEvent, getPrograms, getVerses, getProgramPhotosByProgram, getPublishedPosts, getSiteSettings } from "@/lib/queries";
import { getPublicUrl } from "@/lib/storage";
import { formatEventDateLong, toIntlLocale } from "@/lib/format";
import { excerptFromHtml } from "@/lib/excerpt";
import { SocialButtons } from "@/components/site/SocialButtons";

// The program shown in the second home banner.
const OUTREACH_SLUG = "outreach-programs-for-children-and-youth";

// "Puerto Píritu, Anzoátegui, Venezuela" -> "Puerto Píritu"
function placeName(location: string) {
  return location.split(",")[0].trim();
}

// A mix of real photos from every place we have worked: take one from each
// location in turn, so the mosaic never shows the same jornada eight times.
function mosaicPhotos<T extends { photos: { storage_path: string | null }[] }>(groups: T[], max: number) {
  const picked: { group: T; path: string }[] = [];
  for (let round = 0; picked.length < max; round++) {
    let added = false;
    for (const group of groups) {
      const path = group.photos[round]?.storage_path;
      if (path && picked.length < max) {
        picked.push({ group, path });
        added = true;
      }
    }
    if (!added) break;
  }
  return picked;
}

export default async function HomePage() {
  const contentLocale = await getLocale();
  const [t, tNav, tStories, locale, stories, nextEvent, galleryGroups, settings, programs, programPhotos, verses] = await Promise.all([
    getTranslations("home"),
    getTranslations("nav"),
    getTranslations("stories"),
    getLocale(),
    getPublishedPosts("story", contentLocale),
    getNextEvent(contentLocale),
    getGalleryGroups(contentLocale),
    getSiteSettings(),
    getPrograms(contentLocale),
    getProgramPhotosByProgram(contentLocale),
    getVerses(contentLocale),
  ]);
  const featuredStories = stories.slice(0, 3);
  const mosaic = mosaicPhotos(galleryGroups, 9);

  const flagship = programs.find((p) => p.category === "flagship");
  const flagshipCover = flagship ? (flagship.photo_path ?? programPhotos.get(flagship.id)?.[0]?.storage_path ?? null) : null;
  const outreach = programs.find((p) => p.slug === OUTREACH_SLUG);
  const outreachPhotos = outreach
    ? [outreach.photo_path, ...(programPhotos.get(outreach.id) ?? []).map((p) => p.storage_path)]
        .filter((p): p is string => Boolean(p))
        .slice(0, 4)
    : [];
  const relief = programs.find((p) => p.slug === "disaster-relief");
  const reliefCover = relief ? (relief.photo_path ?? programPhotos.get(relief.id)?.[0]?.storage_path ?? null) : null;

  const HOME_STATS = [
    { value: settings.countries_served, label: t("statCountries") },
    { value: settings.jornadas_completed, label: t("statJornadas") },
    { value: settings.scholarships_stat, label: t("statStudents") },
    { value: settings.families_reached, label: t("statFamilies") },
  ];

  const EXPLORE = [
    { href: "/programs", Icon: BookOpen, title: tNav("programs"), desc: t("exploreProgramsDesc") },
    { href: "/jornadas", Icon: Compass, title: tNav("jornadas"), desc: t("exploreJornadasDesc") },
    { href: "/stories", Icon: Newspaper, title: tNav("storiesBlog"), desc: t("exploreStoriesDesc") },
    { href: "/gallery", Icon: Images, title: tNav("gallery"), desc: t("exploreGalleryDesc") },
    { href: "/events", Icon: CalendarDays, title: tNav("events"), desc: t("exploreEventsDesc") },
    { href: "/impact", Icon: ChartColumn, title: tNav("impact"), desc: t("exploreImpactDesc") },
  ];

  const REGIONS = [
    { label: t("regionSaLabel"), places: t("regionSaPlaces") },
    { label: t("regionCaLabel"), places: t("regionCaPlaces") },
    { label: t("regionNaLabel"), places: t("regionNaPlaces") },
  ];

  return (
    <main>
      {/* HERO */}
      <section className="relative mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-14 overflow-hidden px-5 sm:px-8 pb-16 pt-12 md:pt-[72px] md:grid-cols-[1.1fr_1fr]">
        <div
          aria-hidden
          className="dawn-glow pointer-events-none absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(94,203,234,0.16)_0%,rgba(94,203,234,0)_70%)]"
        />
        <div>
          <span className="rise block text-[13px] font-bold uppercase tracking-[2px] text-blue">{t("eyebrow")}</span>
          <h1 className="rise accent-em mt-4 font-serif text-[40px] font-semibold leading-[1.1] sm:text-[52px]" style={{ animationDelay: "90ms" }}>
            {t.rich("heroTitle", { em: (chunks) => <em>{chunks}</em> })}
          </h1>
          <p className="rise mt-5 max-w-[520px] text-lg leading-relaxed text-muted" style={{ animationDelay: "200ms" }}>{t("heroBody")}</p>
          <div className="rise mt-7 flex flex-wrap gap-3.5" style={{ animationDelay: "310ms" }}>
            <Button href="/programs" variant="primary" size="lg">
              {t("viewPrograms")}
            </Button>
            <Button href="/donate" variant="outline" size="lg">
              {t("donate")}
            </Button>
          </div>
        </div>
        <div className="rise" style={{ animationDelay: "250ms" }}>
          <Photo
            path={settings.hero_photo_path}
            alt={t("heroPhotoAlt")}
            tone="warm"
            aspect="5/4"
            label={"PHOTO\nvolunteers at a jornada"}
            rounded="10px"
            priority
            sizes="(max-width: 768px) 100vw, 560px"
          />
        </div>
      </section>

      {/* STATS BAR */}
      <section className="border-y border-border bg-gradient-to-r from-surface-soft-2 via-surface-soft to-surface-soft-2">
        <div className="mx-auto grid max-w-[1240px] grid-cols-2 gap-6 px-5 sm:px-8 py-9 text-center md:grid-cols-4">
          {HOME_STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 90}>
              <StatTile value={s.value} label={s.label} size="lg" tone="accent" countUp />
            </Reveal>
          ))}
        </div>
      </section>

      {/* VIDEO — shown once a video is set in Admin > Settings */}
      {settings.home_video_url ? (
        <section aria-labelledby="home-video-heading" className="mx-auto max-w-[1240px] px-5 sm:px-8 pt-12 md:pt-[72px]">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_1.6fr] lg:gap-12">
            <div>
              <span className="text-[13px] font-bold uppercase tracking-[2px] text-blue">{t("videoEyebrow")}</span>
              <h2 id="home-video-heading" className="mt-3 font-serif text-[28px] font-semibold leading-tight sm:text-[34px]">
                {t("videoTitle")}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted lg:text-[17px]">{t("videoBody")}</p>
            </div>
            <Reveal>
              <VideoEmbed url={settings.home_video_url} title={t("videoTitle")} className="shadow-[0_18px_50px_rgba(1,19,50,0.2)]" />
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* EXPLORE — a visible map of the whole site, so no page depends on finding it in a menu */}
      <section aria-labelledby="explore-heading" className="mx-auto max-w-[1240px] px-5 sm:px-8 pt-12 md:pt-[72px]">
        <h2 id="explore-heading" className="font-serif text-[26px] font-semibold sm:text-[30px]">
          {t("exploreTitle")}
        </h2>
        <ul role="list" className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {EXPLORE.map(({ href, Icon, title, desc }, i) => (
            <li key={href}>
              <Reveal delay={(i % 3) * 80} className="h-full">
                <Link href={href} className="block h-full">
                  <Card className="card-lift flex h-full items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-blue transition-transform duration-300 group-hover:scale-110">
                      <Icon aria-hidden className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-base font-bold text-ink">{title}</span>
                      <span className="mt-1 block text-[15px] leading-relaxed text-muted-2">{desc}</span>
                    </span>
                  </Card>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* BEYOND VENEZUELA */}
      <section className="mx-auto max-w-[1240px] px-5 sm:px-8 py-12 md:py-[72px]">
        <div className="mb-7 flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-serif text-[26px] font-semibold sm:text-[30px]">{t("beyondTitle")}</h2>
          <Button href="/about" variant="link">
            {t("ourStory")}
          </Button>
        </div>
        <p className="mb-9 max-w-[760px] text-base leading-relaxed lg:text-[17px] text-muted">{t("beyondBody")}</p>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {REGIONS.map((r, i) => (
            <Reveal key={r.label} delay={i * 120}>
              <Card className="card-lift h-full">
                <div className="text-[13px] font-bold tracking-wide text-blue">{r.label}</div>
                <div className="mt-2 font-serif text-lg">{r.places}</div>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SCHOOL OF HOPE FLAGSHIP */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ink-soft via-ink to-ink-dark text-white">
        <SectionWave position="top" />
        <SectionWave position="bottom" className={outreach && outreachPhotos.length >= 2 ? "text-accent-soft!" : undefined} />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-32 -bottom-32 h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(94,203,234,0.14)_0%,rgba(94,203,234,0)_70%)]"
        />
        <div className="relative mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-12 px-5 sm:px-8 py-16 md:py-24 md:grid-cols-2">
          <div>
            <span className="text-[13px] font-bold uppercase tracking-[2px] text-accent-strong">
              {t("flagshipEyebrow")}
            </span>
            <h2 className="mt-3.5 font-serif text-[28px] sm:text-[32px] font-semibold">{t("flagshipTitle")}</h2>
            <p className="mt-4 max-w-[460px] text-base leading-relaxed lg:text-[17px] text-white/85">{t("flagshipBody")}</p>
            <div className="mt-5">
              <Button href={flagship?.slug ? `/programs/${flagship.slug}` : "/programs"} variant="accentOnDark">
                {t("learnMore")}
              </Button>
            </div>
          </div>
          <Photo
            path={flagshipCover}
            alt={t("flagshipPhotoAlt")}
            tone="dark"
            aspect="16/10"
            label={"PHOTO\nSchool of Hope student"}
            rounded="10px"
          />
        </div>
      </section>

      {/* OUTREACH PROGRAMS */}
      {outreach && outreachPhotos.length >= 2 ? (
        <section aria-labelledby="outreach-heading" className="bg-gradient-to-b from-accent-soft to-accent-soft-2">
          <div className="mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.1fr_1fr] md:gap-14 md:py-[72px]">
            <ul role="list" className="grid grid-cols-2 gap-3 md:order-first">
              {outreachPhotos.map((path, i) => (
                <li key={path} className={i % 3 === 0 ? "translate-y-0" : "translate-y-3"}>
                  <Photo path={path} alt={outreach.name} aspect="4/3" rounded="12px" sizes="(max-width: 768px) 50vw, 320px" />
                </li>
              ))}
            </ul>
            <div>
              <span className="text-[13px] font-bold uppercase tracking-[2px] text-blue">{t("outreachEyebrow")}</span>
              <h2 id="outreach-heading" className="mt-3.5 font-serif text-[28px] font-semibold leading-tight sm:text-[34px]">
                {t("outreachTitle")}
              </h2>
              <p className="mt-4 max-w-[480px] text-base leading-relaxed text-muted lg:text-[17px]">{t("outreachBody")}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button href={`/programs/${outreach.slug}`} variant="primary">
                  {t("outreachCta")}
                </Button>
                <Button href="/donate" variant="outline">
                  {t("donate")}
                </Button>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* UPCOMING EVENT */}
      {nextEvent ? (
        <section className="mx-auto max-w-[1240px] px-5 sm:px-8 py-12 md:py-[72px]">
          <div className="mb-7 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h2 className="font-serif text-[26px] font-semibold sm:text-[30px]">{t("upcomingEventTitle")}</h2>
            <Button href="/events" variant="link">
              {t("allEvents")}
            </Button>
          </div>
          <Card padding="none" className="card-lift grid grid-cols-1 overflow-hidden md:grid-cols-[1fr_1.4fr]">
            <Photo path={nextEvent.photo_path} alt={nextEvent.name} aspect="4/3" label={`PHOTO — ${nextEvent.name}`} rounded="0" />
            <div className="flex flex-col justify-center p-6 sm:p-8">
              <span className="text-[15px] font-bold text-accent-deep">
                {formatEventDateLong(nextEvent.event_date, toIntlLocale(locale))} · {nextEvent.location.toUpperCase()}
              </span>
              <h3 className="mt-2.5 font-serif text-2xl font-semibold">{nextEvent.name}</h3>
              <p className="mt-3 mb-4.5 text-base leading-relaxed lg:text-[17px] text-muted">{nextEvent.description}</p>
              <Button href="/events" variant="primary" className="w-fit">
                {nextEvent.cta_label}
              </Button>
            </div>
          </Card>
        </section>
      ) : null}

      {/* BIBLE VERSES */}
      {verses.length > 0 ? (
        <VerseBanner
          verses={verses.map((v) => ({ id: v.id, reference: v.reference, text: v.text }))}
          backgroundPath="site/verse-sea.jpg"
        />
      ) : null}

      {/* STORIES OF HOPE */}
      <section className="mx-auto max-w-[1240px] px-5 sm:px-8 pb-12 md:pb-[72px] pt-4">
        <div className="mb-7 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 className="font-serif text-[26px] font-semibold sm:text-[30px]">{t("storiesTitle")}</h2>
          <Button href="/stories" variant="link">
            {t("readMore")}
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-5.5 md:grid-cols-3">
          {featuredStories.map((s, i) => (
            <Reveal key={s.id} delay={i * 110}>
            <Link href={`/stories/${s.slug}`} className="block h-full">
              <Card padding="none" className="card-lift h-full overflow-hidden">
                <div className="relative">
                  <Photo path={s.photo_path} alt={s.title} aspect="4/3" label={`PHOTO — ${s.title.split(" ")[0]}`} rounded="0" />
                  {s.video_url ? <VideoBadge label={tStories("video")} /> : null}
                </div>
                <div className="p-5">
                  <div className="text-base font-bold">{s.title}</div>
                  <div className="mt-1.5 text-[15px] leading-relaxed text-muted-2">{excerptFromHtml(s.body)}</div>
                </div>
              </Card>
            </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FROM OUR JORNADAS */}
      <section className="mx-auto max-w-[1240px] px-5 sm:px-8 pb-12 md:pb-[72px] pt-4">
        <div className="mb-7 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 className="font-serif text-[26px] font-semibold sm:text-[30px]">{t("jornadasTitle")}</h2>
          <Button href="/gallery" variant="link">
            {t("fullGallery")}
          </Button>
        </div>
        <ul role="list" className="grid auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[190px] md:grid-cols-4">
          {mosaic.map(({ group, path }, i) => {
            const url = getPublicUrl(path);
            if (!url) return null;
            const feature = i === 0 && mosaic.length >= 5;
            return (
              <li key={path} className={feature ? "col-span-2 row-span-2" : undefined}>
                <Link href="/gallery" className="group relative block h-full w-full overflow-hidden rounded-lg bg-surface-soft-2">
                  <Image
                    src={url}
                    alt={group.caption || group.location}
                    fill
                    sizes={feature ? "(max-width: 768px) 100vw, 620px" : "(max-width: 768px) 50vw, 310px"}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-dark/80 to-transparent px-3 pb-2.5 pt-8 text-[13px] font-semibold text-white">
                    {placeName(group.location)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* EARTHQUAKE RELIEF */}
      {relief && reliefCover ? (
        <section aria-labelledby="relief-heading" className="mx-auto max-w-[1240px] px-5 sm:px-8 pb-12 md:pb-[72px]">
          <Card padding="none" highlight className="grid grid-cols-1 overflow-hidden md:grid-cols-2">
            <Photo path={reliefCover} alt={relief.name} aspect="4/3" rounded="0" className="md:h-full md:aspect-auto!" />
            <div className="flex flex-col justify-center p-6 sm:p-10">
              <span className="text-[13px] font-bold uppercase tracking-[2px] text-blue">{t("reliefEyebrow")}</span>
              <h2 id="relief-heading" className="mt-3 font-serif text-[26px] font-semibold leading-tight sm:text-[32px]">
                {t("reliefTitle")}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted lg:text-[17px]">{t("reliefBody")}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button href="/donate" variant="primary">
                  {t("reliefCta")}
                </Button>
                <Button href={`/programs/${relief.slug}`} variant="outline">
                  {t("reliefLearn")}
                </Button>
              </div>
            </div>
          </Card>
        </section>
      ) : null}

      {/* SPONSORS */}
      <SponsorsStrip className="border-t border-border bg-surface" />

      {/* FOLLOW US */}
      <section className="border-t border-border bg-gradient-to-b from-surface-soft-2 to-surface-soft">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8 py-14">
          <h2 id="follow-us-heading" className="mb-6 font-serif text-2xl font-semibold">{t("followUs")}</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[1.3fr_1fr]">
            <SocialButtons labelledBy="follow-us-heading" />
            <Card>
              <div className="mb-2.5 text-[12.5px] font-bold tracking-wide text-label">{t("latest")}</div>
              <div className="text-[15px] leading-relaxed text-muted">{t("quote")}</div>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
