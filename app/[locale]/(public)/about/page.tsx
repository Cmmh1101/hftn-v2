import { getTranslations } from "next-intl/server";
import { Photo } from "@/components/ui/Photo";
import { PageIntro } from "@/components/site/PageIntro";
import { Button } from "@/components/ui/Button";
import { getLeaders } from "@/lib/queries";

export default async function AboutPage() {
  const [t, leaders] = await Promise.all([getTranslations("about"), getLeaders()]);

  const JOURNEY = [
    { year: "2018", desc: t("journey2018") },
    { year: "2023", desc: t("journey2023") },
    { year: "2026", desc: t("journey2026") },
  ];

  return (
    <main className="mx-auto max-w-[1240px] px-8 pb-20 pt-14">
      <PageIntro eyebrow={t("eyebrow")} title={t("title")} />

      <div className="mb-14 grid grid-cols-1 gap-12 md:grid-cols-2">
        <div>
          <h2 className="mb-3 font-serif text-[22px] font-semibold">{t("missionTitle")}</h2>
          <p className="text-[15px] leading-relaxed text-muted">{t("missionBody")}</p>
        </div>
        <div>
          <h2 className="mb-3 font-serif text-[22px] font-semibold">{t("visionTitle")}</h2>
          <p className="text-[15px] leading-relaxed text-muted">{t("visionBody")}</p>
        </div>
      </div>

      <h2 className="mb-6 font-serif text-[22px] font-semibold">{t("journeyTitle")}</h2>
      <div className="mb-14 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {JOURNEY.map((j) => (
          <div key={j.year} className="border-t-[3px] border-accent pt-3.5">
            <div className="font-serif text-xl font-bold">{j.year}</div>
            <div className="mt-1.5 text-[13px] text-muted-2">{j.desc}</div>
          </div>
        ))}
      </div>

      <div className="mb-6 flex items-baseline justify-between">
        <h2 className="font-serif text-[22px] font-semibold">{t("leadershipTitle")}</h2>
        <Button href="/about/team" variant="link">
          {t("meetTeamLink")}
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
        {leaders.map((l) => (
          <div key={l.id}>
            <Photo path={l.photo_path} alt={l.name} aspect="1" label="PHOTO" rounded="8px" className="mb-2.5" />
            <div className="text-sm font-bold">{l.name}</div>
            <div className="text-xs text-muted-2">{l.role}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
