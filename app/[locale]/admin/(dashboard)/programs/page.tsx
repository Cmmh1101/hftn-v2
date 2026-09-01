import { getTranslations } from "next-intl/server";
import { AdminTable, AdminTableRow } from "@/components/site/AdminTable";
import { Badge, type BadgeStatus } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DeleteButton } from "@/components/site/DeleteButton";
import { getPrograms } from "@/lib/queries";
import { deleteProgram } from "./actions";

const GRID = "2fr 1fr 1fr 1fr 1fr 140px";

export default async function AdminProgramsPage() {
  const [t, tStatus, tForm, programs] = await Promise.all([
    getTranslations("admin.programs"),
    getTranslations("status"),
    getTranslations("admin.form"),
    getPrograms(),
  ]);

  return (
    <main className="p-8">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="font-serif text-[26px] font-semibold">{t("title")}</h1>
        <Button href="/admin/programs/new" variant="primary" size="sm">
          {t("newJornada")}
        </Button>
      </div>
      <AdminTable
        columns={[t("colName"), t("colType"), t("colRegion"), t("colParticipants"), t("colStatus"), ""]}
        gridTemplate={GRID}
      >
        {programs.map((p) => (
          <AdminTableRow key={p.id} gridTemplate={GRID}>
            <span className="font-semibold">{p.name}</span>
            <span className="text-muted-2">{p.type}</span>
            <span className="text-muted-2">{p.region}</span>
            <span>{p.participants}</span>
            <Badge status={p.status as BadgeStatus}>{tStatus(p.status)}</Badge>
            <div className="flex gap-3">
              <Button href={`/admin/programs/${p.id}/edit`} variant="link" size="sm">
                {t("edit")}
              </Button>
              <DeleteButton
                action={deleteProgram}
                confirmMessage={tForm("confirmDelete")}
                label={tForm("delete")}
                confirmLabel={tForm("confirmYes")}
                cancelLabel={tForm("cancel")}
                hiddenFields={{ id: p.id }}
              />
            </div>
          </AdminTableRow>
        ))}
      </AdminTable>
    </main>
  );
}
