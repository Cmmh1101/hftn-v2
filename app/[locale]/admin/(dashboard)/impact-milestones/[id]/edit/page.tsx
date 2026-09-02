import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { MilestoneForm } from "@/components/site/MilestoneForm";
import { createClient } from "@/lib/supabase/server";
import { updateMilestone } from "../../actions";

export default async function EditMilestonePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [t, supabase] = await Promise.all([getTranslations("admin.milestones"), createClient()]);
  const { data: milestone } = await supabase.from("impact_milestones").select("*").eq("id", id).single();

  if (!milestone) notFound();

  return (
    <main className="p-8">
      <h1 className="mb-6 font-serif text-[26px] font-semibold">{t("editTitle")}</h1>
      <MilestoneForm action={updateMilestone.bind(null, id)} milestone={milestone} />
    </main>
  );
}
