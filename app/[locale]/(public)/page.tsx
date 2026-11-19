import { BookOpen, CalendarDays, ChartColumn, Compass, Images, Newspaper } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { SectionWave } from "@/components/ui/SectionWave";
import { StatTile } from "@/components/ui/StatTile";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { Photo } from "@/components/ui/Photo";
import { getGalleryGroups, getNextEvent, getPublishedPosts, getSiteSettings } from "@/lib/queries";
import { formatEventDateLong, toIntlLocale } from "@/lib/format";
import { excerptFromHtml } from "@/lib/excerpt";
import { SocialButtons } from "@/components/site/SocialButtons";

function locationLabel(location: string) {
  const parts = location.split(",");
  return parts[parts.length - 1].trim();
}

export default async function HomePage() {
  const [t, tNav, locale, stories, nextEvent, galleryGroups, settings] = await Promise.all([
    getTranslations("home"),
    getTranslations("nav"),
    getLocale(),
    getPublishedPosts("story"),
    getNextEvent(),
    getGalleryGroups(),
    getSiteSettings(),
  ]);
  const featuredStories = stories.slice(0, 3);
  const galleryTeaser = galleryGroups.slice(0, 6);

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
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
        <SectionWave position="bottom" />
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
              <Button href="/programs" variant="accentOnDark">
                {t("learnMore")}
              </Button>
            </div>
          </div>
          <PhotoPlaceholder tone="dark" aspect="16/10" label={"PHOTO\nSchool of Hope student"} rounded="10px" />
        </div>
      </section>

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
                <Photo path={s.photo_path} alt={s.title} aspect="4/3" label={`PHOTO — ${s.title.split(" ")[0]}`} rounded="0" />
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
        <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
          {galleryTeaser.map((g) => (
            <Photo
              key={g.location}
              path={g.photos[0]?.storage_path}
              alt={g.location}
              aspect="1"
              label={locationLabel(g.location)}
              rounded="6px"
            />
          ))}
        </div>
      </section>

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
