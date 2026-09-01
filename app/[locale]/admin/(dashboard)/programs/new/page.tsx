import { getTranslations } from "next-intl/server";
import { ProgramForm } from "@/components/site/ProgramForm";
import { createProgram } from "../actions";

export default async function NewProgramPage() {
  const t = await getTranslations("admin.programs");

  return (
    <main className="p-8">
      <h1 className="mb-6 font-serif text-[26px] font-semibold">{t("newTitle")}</h1>
      <ProgramForm action={createProgram} />
    </main>
  );
}
