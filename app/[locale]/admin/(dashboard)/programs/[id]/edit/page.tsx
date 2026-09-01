import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ProgramForm } from "@/components/site/ProgramForm";
import { createClient } from "@/lib/supabase/server";
import { updateProgram } from "../../actions";

export default async function EditProgramPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [t, supabase] = await Promise.all([getTranslations("admin.programs"), createClient()]);
  const { data: program } = await supabase.from("programs").select("*").eq("id", id).single();

  if (!program) notFound();

  return (
    <main className="p-8">
      <h1 className="mb-6 font-serif text-[26px] font-semibold">{t("editTitle")}</h1>
      <ProgramForm action={updateProgram.bind(null, id)} program={program} />
    </main>
  );
}
