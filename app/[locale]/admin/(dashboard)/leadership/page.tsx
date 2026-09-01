import { getTranslations } from "next-intl/server";
import { AdminTable, AdminTableRow } from "@/components/site/AdminTable";
import { Button } from "@/components/ui/Button";
import { DeleteButton } from "@/components/site/DeleteButton";
import { getLeaders } from "@/lib/queries";
import { deleteLeader } from "./actions";

const GRID = "2fr 2fr 140px";

export default async function AdminLeadershipPage() {
  const [t, tForm, leaders] = await Promise.all([
    getTranslations("admin.leadership"),
    getTranslations("admin.form"),
    getLeaders(),
  ]);

  return (
    <main className="p-8">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="font-serif text-[26px] font-semibold">{t("title")}</h1>
        <Button href="/admin/leadership/new" variant="primary" size="sm">
          {t("newLeader")}
        </Button>
      </div>
      <AdminTable columns={[t("colName"), t("colRole"), ""]} gridTemplate={GRID}>
        {leaders.map((l) => (
          <AdminTableRow key={l.id} gridTemplate={GRID}>
            <span className="font-semibold">{l.name}</span>
            <span className="text-muted-2">{l.role}</span>
            <div className="flex gap-3">
              <Button href={`/admin/leadership/${l.id}/edit`} variant="link" size="sm">
                {t("edit")}
              </Button>
              <DeleteButton
                action={deleteLeader}
                confirmMessage={tForm("confirmDelete")}
                label={tForm("delete")}
                hiddenFields={{ id: l.id }}
              />
            </div>
          </AdminTableRow>
        ))}
      </AdminTable>
    </main>
  );
}
