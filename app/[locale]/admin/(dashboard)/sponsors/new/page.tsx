import { getTranslations } from "next-intl/server";
import { SponsorForm } from "@/components/site/SponsorForm";
import { createSponsor } from "../actions";

export default async function NewSponsorPage() {
  const t = await getTranslations("admin.sponsors");

  return (
    <main className="p-4 sm:p-8">
      <h1 className="mb-6 font-serif text-[26px] font-semibold">{t("newTitle")}</h1>
      <SponsorForm action={createSponsor} />
    </main>
  );
}
