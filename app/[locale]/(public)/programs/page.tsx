import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/Card";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { PageIntro } from "@/components/site/PageIntro";
import { getPrograms } from "@/lib/queries";

export default async function ProgramsPage() {
  const [t, tCategory, programs] = await Promise.all([
    getTranslations("programs"),
    getTranslations("programCategory"),
    getPrograms(),
  ]);

  const flagship = programs.find((p) => p.category === "flagship");
  // Only ongoing ministries belong in this overview grid — a completed
  // historical jornada (e.g. a past disaster response) shouldn't show up
  // next to the general "Disaster Relief" program card.
  const continuousAndRelief = programs.filter(
    (p) => (p.category === "continuous" || p.category === "relief") && p.status === "Active",
  );

  const JORNADA_TYPES = [
    t("jornadaMedical"),
    t("jornadaFeeding"),
    t("jornadaEvangelization"),
    t("jornadaYouth"),
    t("jornadaResource"),
  ];

  return (
    <main className="mx-auto max-w-[1240px] px-8 pb-20 pt-14">
      <PageIntro eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />

      {flagship ? (
        <Card highlight className="mb-5 grid grid-cols-1 items-center gap-8 md:grid-cols-2">
          <div>
            <span className="text-xs font-bold tracking-wide text-accent-deep">
              {tCategory("flagship").toUpperCase()} · {flagship.type.toUpperCase()}
            </span>
            <h2 className="mt-2.5 font-serif text-[26px] font-semibold">{flagship.name}</h2>
            <p className="mt-3 text-[14.5px] leading-relaxed text-muted">{flagship.summary}</p>
          </div>
          <PhotoPlaceholder tone="warm" aspect="16/9" label="PHOTO — online classroom" />
        </Card>
      ) : null}

      <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-3">
        {continuousAndRelief.map((p) => (
          <Card key={p.id} padding="none" className="overflow-hidden">
            <PhotoPlaceholder aspect="4/3" label={`PHOTO — ${p.name}`} rounded="0" />
            <div className="p-5">
              <span className="text-[11px] font-bold tracking-wide text-blue">
                {tCategory(p.category).toUpperCase()}
              </span>
              <h3 className="mt-2 font-serif text-[19px]">{p.name}</h3>
              <p className="mt-2 text-[13.5px] leading-normal text-muted">{p.summary}</p>
            </div>
          </Card>
        ))}
      </div>

      <h2 className="mb-2 mt-11 font-serif text-2xl font-semibold">{t("jornadasTitle")}</h2>
      <p className="mb-5 max-w-[640px] text-[14.5px] leading-relaxed text-muted">{t("jornadasIntro")}</p>
      <div className="grid grid-cols-2 gap-3.5 md:grid-cols-5">
        {JORNADA_TYPES.map((label) => (
          <Card key={label} className="text-center">
            <div className="text-[13px] font-bold">{label}</div>
          </Card>
        ))}
      </div>
    </main>
  );
}
