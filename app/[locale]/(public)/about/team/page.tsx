import { getTranslations } from "next-intl/server";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { Card } from "@/components/ui/Card";
import { PageIntro } from "@/components/site/PageIntro";
import { getLeaders } from "@/lib/queries";

export default async function TeamPage() {
  const [t, leaders] = await Promise.all([getTranslations("team"), getLeaders()]);

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
    <main className="mx-auto max-w-[1240px] px-8 pb-20 pt-14">
      <PageIntro eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />

      <h2 className="mb-6 font-serif text-[22px] font-semibold">{t("leadershipTitle")}</h2>
      <div className="mb-14 grid grid-cols-1 gap-8 md:grid-cols-2">
        {leaders.map((l) => (
          <div key={l.id} className="flex gap-5">
            <PhotoPlaceholder aspect="1" label="PHOTO" rounded="8px" className="w-28 shrink-0" />
            <div>
              <div className="text-base font-bold">{l.name}</div>
              <div className="mt-0.5 text-xs font-bold uppercase tracking-wide text-blue">{l.role}</div>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-muted">{l.bio}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mb-3 font-serif text-[22px] font-semibold">{t("boardTitle")}</h2>
      <p className="max-w-[720px] text-[15px] leading-relaxed text-muted">{t("boardBody")}</p>
      <p className="mb-14 mt-3 text-sm italic text-label">{t("boardComingSoon")}</p>

      <h2 className="mb-3 font-serif text-[22px] font-semibold">{t("schoolTitle")}</h2>
      <p className="mb-14 max-w-[720px] text-[15px] leading-relaxed text-muted">{t("schoolBody")}</p>

      <h2 className="mb-3 font-serif text-[22px] font-semibold">{t("volunteersTitle")}</h2>
      <p className="mb-14 max-w-[720px] text-[15px] leading-relaxed text-muted">{t("volunteersBody")}</p>

      <h2 className="mb-2 font-serif text-[22px] font-semibold">{t("cultureTitle")}</h2>
      <p className="mb-6 max-w-[720px] text-[15px] leading-relaxed text-muted">{t("cultureIntro")}</p>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {VALUES.map((v) => (
          <Card key={v.title}>
            <div className="text-sm font-bold text-accent-deep">{v.title}</div>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted-2">{v.body}</p>
          </Card>
        ))}
      </div>
    </main>
  );
}
