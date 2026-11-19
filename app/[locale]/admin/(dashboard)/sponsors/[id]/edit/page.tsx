import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { SponsorForm } from "@/components/site/SponsorForm";
import { createClient } from "@/lib/supabase/server";
import { updateSponsor } from "../../actions";

export default async function EditSponsorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [t, supabase] = await Promise.all([getTranslations("admin.sponsors"), createClient()]);
  const { data: sponsor } = await supabase.from("sponsors").select("*").eq("id", id).single();

  if (!sponsor) notFound();

  return (
    <main className="p-4 sm:p-8">
      <h1 className="mb-6 font-serif text-[26px] font-semibold">{t("editTitle")}</h1>
      <SponsorForm action={updateSponsor.bind(null, id)} sponsor={sponsor} />
    </main>
  );
}
