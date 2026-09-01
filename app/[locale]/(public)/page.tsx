import { getTranslations, getLocale } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatTile } from "@/components/ui/StatTile";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { Photo } from "@/components/ui/Photo";
import { getGalleryGroups, getNextEvent, getPublishedPosts, getSiteSettings } from "@/lib/queries";
import { formatEventDateLong, toIntlLocale } from "@/lib/format";

function locationLabel(location: string) {
  const parts = location.split(",");
  return parts[parts.length - 1].trim();
}

export default async function HomePage() {
  const [t, locale, stories, nextEvent, galleryGroups, settings] = await Promise.all([
    getTranslations("home"),
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

  const REGIONS = [
    { label: t("regionSaLabel"), places: t("regionSaPlaces") },
    { label: t("regionNaLabel"), places: t("regionNaPlaces") },
  ];

  return (
    <main>
      {/* HERO */}
      <section className="mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-14 px-8 pb-16 pt-[72px] md:grid-cols-[1.1fr_1fr]">
        <div>
          <span className="text-xs font-bold uppercase tracking-[2px] text-blue">{t("eyebrow")}</span>
          <h1 className="mt-4 font-serif text-[52px] font-semibold leading-[1.08]">{t("heroTitle")}</h1>
          <p className="mt-5 max-w-[520px] text-[17px] leading-relaxed text-muted">{t("heroBody")}</p>
          <div className="mt-7 flex gap-3.5">
            <Button href="/programs" variant="primary" size="lg">
              {t("viewPrograms")}
            </Button>
            <Button href="/donate" variant="outline" size="lg">
              {t("donate")}
            </Button>
          </div>
        </div>
        <PhotoPlaceholder tone="warm" aspect="5/4" label={"PHOTO\nvolunteers at a jornada"} rounded="10px" />
      </section>

      {/* STATS BAR */}
      <section className="border-y border-border bg-surface-soft-2">
        <div className="mx-auto grid max-w-[1240px] grid-cols-2 gap-6 px-8 py-9 text-center md:grid-cols-4">
          {HOME_STATS.map((s) => (
            <StatTile key={s.label} value={s.value} label={s.label} size="lg" tone="accent" />
          ))}
        </div>
      </section>

      {/* BEYOND VENEZUELA */}
      <section className="mx-auto max-w-[1240px] px-8 py-[72px]">
        <div className="mb-7 flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-serif text-[30px] font-semibold">{t("beyondTitle")}</h2>
          <Button href="/about" variant="link">
            {t("ourStory")}
          </Button>
        </div>
        <p className="mb-9 max-w-[760px] text-base leading-relaxed text-muted">{t("beyondBody")}</p>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {REGIONS.map((r) => (
            <Card key={r.label}>
              <div className="text-xs font-bold tracking-wide text-blue">{r.label}</div>
              <div className="mt-2 font-serif text-lg">{r.places}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* SCHOOL OF HOPE FLAGSHIP */}
      <section className="bg-ink text-white">
        <div className="mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-12 px-8 py-16 md:grid-cols-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-[2px] text-accent-strong">
              {t("flagshipEyebrow")}
            </span>
            <h2 className="mt-3.5 font-serif text-[32px] font-semibold">{t("flagshipTitle")}</h2>
            <p className="mt-4 max-w-[460px] text-[15px] leading-relaxed text-white/85">{t("flagshipBody")}</p>
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
        <section className="mx-auto max-w-[1240px] px-8 py-[72px]">
          <div className="mb-7 flex items-baseline justify-between">
            <h2 className="font-serif text-[30px] font-semibold">{t("upcomingEventTitle")}</h2>
            <Button href="/events" variant="link">
              {t("allEvents")}
            </Button>
          </div>
          <Card padding="none" className="grid grid-cols-1 overflow-hidden md:grid-cols-[1fr_1.4fr]">
            <Photo path={nextEvent.photo_path} alt={nextEvent.name} aspect="4/3" label={`PHOTO — ${nextEvent.name}`} rounded="0" />
            <div className="flex flex-col justify-center p-8">
              <span className="text-[13px] font-bold text-accent-deep">
                {formatEventDateLong(nextEvent.event_date, toIntlLocale(locale))} · {nextEvent.location.toUpperCase()}
              </span>
              <h3 className="mt-2.5 font-serif text-2xl font-semibold">{nextEvent.name}</h3>
              <p className="mt-3 mb-4.5 text-[14.5px] leading-relaxed text-muted">{nextEvent.description}</p>
              <Button href="/events" variant="primary" className="w-fit">
                {nextEvent.cta_label}
              </Button>
            </div>
          </Card>
        </section>
      ) : null}

      {/* STORIES OF HOPE */}
      <section className="mx-auto max-w-[1240px] px-8 pb-[72px] pt-4">
        <div className="mb-7 flex items-baseline justify-between">
          <h2 className="font-serif text-[30px] font-semibold">{t("storiesTitle")}</h2>
          <Button href="/stories" variant="link">
            {t("readMore")}
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-5.5 md:grid-cols-3">
          {featuredStories.map((s) => (
            <Card key={s.id} padding="none" className="overflow-hidden">
              <Photo path={s.photo_path} alt={s.title} aspect="4/3" label={`PHOTO — ${s.title.split(" ")[0]}`} rounded="0" />
              <div className="p-5">
                <div className="text-[15px] font-bold">{s.title}</div>
                <div className="mt-1.5 text-[13.5px] leading-relaxed text-muted-2">{s.body}</div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* FROM OUR JORNADAS */}
      <section className="mx-auto max-w-[1240px] px-8 pb-[72px] pt-4">
        <div className="mb-7 flex items-baseline justify-between">
          <h2 className="font-serif text-[30px] font-semibold">{t("jornadasTitle")}</h2>
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
      <section className="border-t border-border bg-surface-soft-2">
        <div className="mx-auto max-w-[1240px] px-8 py-14">
          <h2 className="mb-6 font-serif text-2xl font-semibold">{t("followUs")}</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[1.3fr_1fr]">
            <div className="flex flex-wrap gap-3.5">
              <a
                href="https://www.facebook.com/hopeforthenations7"
                className="rounded-md border border-border bg-surface px-5 py-3 text-sm font-bold text-ink"
              >
                Facebook
              </a>
              <a
                href="https://www.instagram.com/hopeforthenations7/"
                className="rounded-md border border-border bg-surface px-5 py-3 text-sm font-bold text-ink"
              >
                Instagram
              </a>
              <a
                href="https://www.youtube.com/channel/UCknlRAt1zFByIgx-5MaRrLA"
                className="rounded-md border border-border bg-surface px-5 py-3 text-sm font-bold text-ink"
              >
                YouTube
              </a>
            </div>
            <Card>
              <div className="mb-2.5 text-[11px] font-bold tracking-wide text-label">{t("latest")}</div>
              <div className="text-[13.5px] leading-relaxed text-muted">{t("quote")}</div>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
