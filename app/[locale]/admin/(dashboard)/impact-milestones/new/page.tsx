import { getTranslations } from "next-intl/server";
import { MilestoneForm } from "@/components/site/MilestoneForm";
import { createMilestone } from "../actions";

export default async function NewMilestonePage() {
  const t = await getTranslations("admin.milestones");

  return (
    <main className="p-8">
      <h1 className="mb-6 font-serif text-[26px] font-semibold">{t("newTitle")}</h1>
      <MilestoneForm action={createMilestone} />
    </main>
  );
}
