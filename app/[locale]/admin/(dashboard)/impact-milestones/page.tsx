import { getTranslations } from "next-intl/server";
import { AdminTable, AdminTableRow } from "@/components/site/AdminTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DeleteButton } from "@/components/site/DeleteButton";
import { getImpactMilestones } from "@/lib/queries";
import { deleteMilestone } from "./actions";

const GRID = "1fr 1.5fr 2fr 1fr 140px";

export default async function AdminImpactMilestonesPage() {
  const [t, tForm, milestones] = await Promise.all([
    getTranslations("admin.milestones"),
    getTranslations("admin.form"),
    getImpactMilestones(),
  ]);

  return (
    <main className="p-8">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="font-serif text-[26px] font-semibold">{t("title")}</h1>
        <Button href="/admin/impact-milestones/new" variant="primary" size="sm">
          {t("newMilestone")}
        </Button>
      </div>
      <AdminTable
        columns={[t("colPeriod"), t("colArea"), t("colImpact"), t("colGoal"), ""]}
        gridTemplate={GRID}
      >
        {milestones.map((m) => (
          <AdminTableRow key={m.id} gridTemplate={GRID}>
            <span className="font-semibold">{m.period}</span>
            <span className="text-muted-2">{m.area}</span>
            <span className="text-muted-2">{m.impact_value}</span>
            {m.is_goal ? <Badge status="Planned">{t("goalYes")}</Badge> : <span className="text-muted-2">—</span>}
            <div className="flex gap-3">
              <Button href={`/admin/impact-milestones/${m.id}/edit`} variant="link" size="sm">
                {t("edit")}
              </Button>
              <DeleteButton
                action={deleteMilestone}
                confirmMessage={tForm("confirmDelete")}
                label={tForm("delete")}
                confirmLabel={tForm("confirmYes")}
                cancelLabel={tForm("cancel")}
                hiddenFields={{ id: m.id }}
              />
            </div>
          </AdminTableRow>
        ))}
      </AdminTable>
    </main>
  );
}
