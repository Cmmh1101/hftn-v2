import { getTranslations } from "next-intl/server";
import { PageIntro } from "@/components/site/PageIntro";
import { DonateForm } from "@/components/site/DonateForm";
import { getActivePrograms } from "@/lib/queries";

export default async function DonatePage() {
  const [t, programs] = await Promise.all([getTranslations("donate"), getActivePrograms()]);

  return (
    <main className="mx-auto max-w-[1240px] px-8 pb-20 pt-14">
      <PageIntro eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />
      <DonateForm programs={programs} />
    </main>
  );
}
