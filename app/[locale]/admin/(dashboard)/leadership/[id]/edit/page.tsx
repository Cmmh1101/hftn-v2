import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { LeaderForm } from "@/components/site/LeaderForm";
import { createClient } from "@/lib/supabase/server";
import { updateLeader } from "../../actions";

export default async function EditLeaderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [t, supabase] = await Promise.all([getTranslations("admin.leadership"), createClient()]);
  const { data: leader } = await supabase.from("leaders").select("*").eq("id", id).single();

  if (!leader) notFound();

  return (
    <main className="p-8">
      <h1 className="mb-6 font-serif text-[26px] font-semibold">{t("editTitle")}</h1>
      <LeaderForm action={updateLeader.bind(null, id)} leader={leader} />
    </main>
  );
}
