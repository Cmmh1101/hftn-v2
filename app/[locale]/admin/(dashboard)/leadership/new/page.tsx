import { getTranslations } from "next-intl/server";
import { LeaderForm } from "@/components/site/LeaderForm";
import { createLeader } from "../actions";

export default async function NewLeaderPage() {
  const t = await getTranslations("admin.leadership");

  return (
    <main className="p-8">
      <h1 className="mb-6 font-serif text-[26px] font-semibold">{t("newTitle")}</h1>
      <LeaderForm action={createLeader} />
    </main>
  );
}
