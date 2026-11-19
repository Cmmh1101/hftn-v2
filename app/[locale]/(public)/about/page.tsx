import { getTranslations, getLocale } from "next-intl/server";
import { Photo } from "@/components/ui/Photo";
import { PageIntro } from "@/components/site/PageIntro";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { SponsorsStrip } from "@/components/site/SponsorsStrip";
import { getLeaders } from "@/lib/queries";

// Photography for this page, uploaded once to the media library.
const PHOTO_VOLUNTEERS = "site/about-volunteers.jpg";
const PHOTO_GROUP = "site/about-group.jpg";
const PHOTO_CHILDREN = "site/about-children.jpg";

export default async function AboutPage() {
  const contentLocale = await getLocale();
  const [t, allLeaders] = await Promise.all([getTranslations("about"), getLeaders(contentLocale)]);
  const leaders = allLeaders.filter((l) => l.team !== "outreach");

  const TIMELINE = [
    { year: "2018", title: t("timeline2018Title"), body: t("timeline2018Body") },
    { year: "2023", title: t("timeline2023Title"), body: t("timeline2023Body") },
    { year: "2025", title: t("timelineFloridaTitle"), body: t("timelineFloridaBody") },
    { year: "2025", title: t("timelineInfraTitle"), body: t("timelineInfraBody") },
    { year: "2025", title: t("timelineSohTitle"), body: t("timelineSohBody") },
    { year: "2026", title: t("timeline2026Title"), body: t("timeline2026Body") },
  ];
  const BEGINNING = [t("beginning1"), t("beginning2"), t("beginning3"), t("beginning4"), t("beginning5")];

  return (
    <>
      <main className="mx-auto max-w-[1240px] px-5 pb-16 pt-10 sm:px-8 sm:pb-20 sm:pt-14">
        <PageIntro eyebrow={t("eyebrow")} title={t("title")} />

        <Photo
          path={PHOTO_VOLUNTEERS}
          alt={t("heroPhotoAlt")}
          aspect="16/7"
          rounded="14px"
          className="mb-14 max-md:aspect-[4/3]!"
          sizes="(max-width: 1240px) 100vw, 1240px"
          priority
        />

        <section aria-labelledby="who-heading" className="mb-16 grid grid-cols-1 items-center gap-10 md:grid-cols-[1.2fr_1fr]">
          <div className="flex flex-col gap-4 text-base leading-relaxed text-muted lg:text-[17px]">
            <h2 id="who-heading" className="font-serif text-[26px] font-semibold text-ink sm:text-[30px]">
              {t("whoTitle")}
            </h2>
            <p>{t("whoBody1")}</p>
            <p>{t("whoBody2")}</p>
            <p>{t("whoBody3")}</p>
          </div>
          <Photo path={PHOTO_GROUP} alt={t("whoPhotoAlt")} aspect="4/3" rounded="12px" />
        </section>

        <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card padding="lg">
            <h2 className="mb-3 font-serif text-[22px] font-semibold">{t("missionTitle")}</h2>
            <div className="flex flex-col gap-3 text-base leading-relaxed text-muted lg:text-[17px]">
              <p>{t("missionBody")}</p>
              <p>{t("missionBody2")}</p>
              <p>{t("missionBody3")}</p>
            </div>
          </Card>
          <Card padding="lg">
            <h2 className="mb-3 font-serif text-[22px] font-semibold">{t("visionTitle")}</h2>
            <div className="flex flex-col gap-3 text-base leading-relaxed text-muted lg:text-[17px]">
              <p>{t("visionBody")}</p>
              <p>{t("visionBody2")}</p>
              <p>{t("visionBody3")}</p>
            </div>
          </Card>
        </div>

        <section aria-labelledby="beginning-heading" className="mb-16 grid grid-cols-1 items-center gap-10 md:grid-cols-[1fr_1.2fr]">
          <Photo path={PHOTO_CHILDREN} alt={t("beginningPhotoAlt")} aspect="16/10" rounded="12px" className="md:order-first" />
          <div>
            <span className="text-[13px] font-bold uppercase tracking-[2px] text-blue">{t("beginningEyebrow")}</span>
            <h2 id="beginning-heading" className="mt-3 font-serif text-[26px] font-semibold sm:text-[30px]">
              {t("beginningTitle")}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted lg:text-[17px]">{t("beginningIntro")}</p>
            <ul className="mt-4 list-disc space-y-1.5 pl-5 text-base text-muted lg:text-[17px]">
              {BEGINNING.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="timeline-heading" className="mb-16">
          <h2 id="timeline-heading" className="mb-8 font-serif text-[26px] font-semibold sm:text-[30px]">
            {t("timelineTitle")}
          </h2>
          <ol role="list" className="relative ml-3 border-l-2 border-accent-strong/60 sm:ml-4">
            {TIMELINE.map((item, i) => (
              <li key={item.title} className="relative pb-9 pl-7 last:pb-0 sm:pl-10">
                <Reveal delay={Math.min(i, 3) * 70}>
                  <span
                    aria-hidden
                    className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-[3px] border-bg bg-blue ring-2 ring-accent-strong/60"
                  />
                  <div className="font-serif text-xl font-bold text-blue">{item.year}</div>
                  <h3 className="mt-1 text-lg font-bold text-ink">{item.title}</h3>
                  <p className="mt-1.5 max-w-[720px] text-base leading-relaxed text-muted lg:text-[17px]">{item.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </section>

        <figure className="relative mb-16 overflow-hidden rounded-2xl bg-gradient-to-br from-ink-soft via-ink to-ink-dark px-6 py-12 text-center text-white sm:px-14 sm:py-16">
          <blockquote className="mx-auto max-w-[820px] font-serif text-xl font-medium italic leading-relaxed sm:text-2xl">
            “{t("quote")}”
          </blockquote>
        </figure>

        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 className="font-serif text-[26px] font-semibold sm:text-[30px]">{t("leadershipTitle")}</h2>
          <Button href="/about/team" variant="link">
            {t("meetTeamLink")}
          </Button>
        </div>
        <ul role="list" className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {leaders.map((l) => (
            <li key={l.id}>
              <Photo path={l.photo_path} alt={t("photoAlt", { name: l.name })} aspect="4/5" rounded="10px" className="mb-3" sizes="(max-width: 768px) 50vw, 300px" />
              <div className="text-base font-bold">{l.name}</div>
              <div className="text-[15px] text-muted-2">{l.role}</div>
            </li>
          ))}
        </ul>
      </main>
      <SponsorsStrip className="border-t border-border bg-surface" />
    </>
  );
}
