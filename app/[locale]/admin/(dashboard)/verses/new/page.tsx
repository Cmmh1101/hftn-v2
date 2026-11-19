import { getTranslations } from "next-intl/server";
import { VerseForm } from "@/components/site/VerseForm";
import { createVerse } from "../actions";

export default async function NewVersePage() {
  const t = await getTranslations("admin.verses");
  return (
    <main className="p-4 sm:p-8">
      <h1 className="mb-6 font-serif text-[26px] font-semibold">{t("newTitle")}</h1>
      <VerseForm action={createVerse} />
    </main>
  );
}
