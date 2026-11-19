import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { VerseForm } from "@/components/site/VerseForm";
import { createClient } from "@/lib/supabase/server";
import { updateVerse } from "../../actions";

export default async function EditVersePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [t, supabase] = await Promise.all([getTranslations("admin.verses"), createClient()]);
  const { data: verse } = await supabase.from("verses").select("*").eq("id", id).single();
  if (!verse) notFound();
  return (
    <main className="p-4 sm:p-8">
      <h1 className="mb-6 font-serif text-[26px] font-semibold">{t("editTitle")}</h1>
      <VerseForm action={updateVerse.bind(null, id)} verse={verse} />
    </main>
  );
}
