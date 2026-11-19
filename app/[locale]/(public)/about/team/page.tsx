import { getTranslations, getLocale } from "next-intl/server";
import { Photo } from "@/components/ui/Photo";
import { Card } from "@/components/ui/Card";
import { PageIntro } from "@/components/site/PageIntro";
import { getLeaders } from "@/lib/queries";

export default async function TeamPage() {
  const contentLocale = await getLocale();
  const [t, tAbout, everyone] = await Promise.all([
    getTranslations("team"),
    getTranslations("about"),
    getLeaders(contentLocale),
  ]);
  const leaders = everyone.filter((l) => l.team !== "outreach");
  const outreach = everyone.filter((l) => l.team === "outreach");
  // Leaders with a written bio get a large card; everyone else a portrait tile.
  const featured = leaders.filter((l) => l.bio);
  const others = leaders.filter((l) => !l.bio);

  const VALUES = [
    { title: t("valueIntegrityTitle"), body: t("valueIntegrityBody") },
    { title: t("valueCompassionTitle"), body: t("valueCompassionBody") },
    { title: t("valuePurposeTitle"), body: t("valuePurposeBody") },
    { title: t("valueExcellenceTitle"), body: t("valueExcellenceBody") },
    { title: t("valueInnovationTitle"), body: t("valueInnovationBody") },
    { title: t("valueFaithTitle"), body: t("valueFaithBody") },
    { title: t("valueServiceTitle"), body: t("valueServiceBody") },
  ];

  return (
    <main className="mx-auto max-w-[1240px] px-5 sm:px-8 pb-16 sm:pb-20 pt-10 sm:pt-14">
      <PageIntro eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />

      <h2 className="mb-6 font-serif text-[26px] font-semibold">{t("leadershipTitle")}</h2>
      {featured.length > 0 ? (
        <div className="mb-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {featured.map((l) => (
            <article key={l.id} className="flex flex-col gap-5 sm:flex-row">
              <Photo
                path={l.photo_path}
                alt={tAbout("photoAlt", { name: l.name })}
                aspect="4/5"
                rounded="12px"
                className="w-full max-w-[260px] shrink-0 self-start sm:w-48 lg:w-52"
                sizes="260px"
              />
              <div>
                <h3 className="text-lg font-bold">{l.name}</h3>
                <div className="mt-0.5 text-[13px] font-bold uppercase tracking-wide text-blue">{l.role}</div>
                <p className="mt-3 text-[15px] leading-relaxed text-muted lg:text-base">{l.bio}</p>
              </div>
            </article>
          ))}
        </div>
      ) : null}
      {others.length > 0 ? (
        <ul role="list" className="mb-14 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
          {others.map((l) => (
            <li key={l.id}>
              <Photo path={l.photo_path} alt={tAbout("photoAlt", { name: l.name })} aspect="4/5" rounded="12px" className="mb-3" sizes="(max-width: 640px) 50vw, 240px" />
              <div className="text-base font-bold">{l.name}</div>
              <div className="mt-0.5 text-[13px] font-bold uppercase leading-snug tracking-wide text-blue">{l.role}</div>
            </li>
          ))}
        </ul>
      ) : null}

      <h2 className="mb-3 font-serif text-[22px] font-semibold">{t("boardTitle")}</h2>
      <p className="max-w-[720px] text-base leading-relaxed lg:text-[17px] text-muted">{t("boardBody")}</p>
      <p className="mb-14 mt-3 text-[15px] italic text-label">{t("boardComingSoon")}</p>

      <h2 className="mb-3 font-serif text-[22px] font-semibold">{t("schoolTitle")}</h2>
      <p className="mb-14 max-w-[720px] text-base leading-relaxed lg:text-[17px] text-muted">{t("schoolBody")}</p>

      <h2 className="mb-3 font-serif text-[22px] font-semibold">{t("volunteersTitle")}</h2>
      <p className="mb-8 max-w-[720px] text-base leading-relaxed lg:text-[17px] text-muted">{t("volunteersBody")}</p>
      {outreach.length > 0 ? (
        <section aria-labelledby="outreach-heading" className="mb-14">
          <h3 id="outreach-heading" className="text-lg font-bold">{t("outreachTitle")}</h3>
          <p className="mb-5 mt-1 max-w-[720px] text-[15px] text-muted-2">{t("outreachIntro")}</p>
          <ul role="list" className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 lg:grid-cols-3">
            {outreach.map((l) => (
              <li key={l.id} className="rounded-lg border border-border-soft bg-accent-soft px-4 py-3">
                <div className="text-base font-bold text-ink">{l.name}</div>
                <div className="text-[14px] text-muted-2">{l.role}</div>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <div className="mb-6" />
      )}

      <h2 className="mb-2 font-serif text-[22px] font-semibold">{t("cultureTitle")}</h2>
      <p className="mb-6 max-w-[720px] text-base leading-relaxed lg:text-[17px] text-muted">{t("cultureIntro")}</p>
      <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 md:grid-cols-4">
        {VALUES.map((v) => (
          <Card key={v.title}>
            <div className="text-[15px] font-bold text-accent-deep">{v.title}</div>
            <p className="mt-1.5 text-[15px] leading-relaxed text-muted-2">{v.body}</p>
          </Card>
        ))}
      </div>
    </main>
  );
}
