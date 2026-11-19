import { getTranslations, getLocale } from "next-intl/server";
import { PageIntro } from "@/components/site/PageIntro";
import { DonateForm } from "@/components/site/DonateForm";
import { getActivePrograms } from "@/lib/queries";

export default async function DonatePage() {
  const contentLocale = await getLocale();
  const [t, programs] = await Promise.all([getTranslations("donate"), getActivePrograms(contentLocale)]);

  return (
    <main className="mx-auto max-w-[1240px] px-5 sm:px-8 pb-16 sm:pb-20 pt-10 sm:pt-14">
      <PageIntro eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />
      <DonateForm programs={programs} />
    </main>
  );
}
