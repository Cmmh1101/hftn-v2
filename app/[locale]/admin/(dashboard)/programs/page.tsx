import { getTranslations } from "next-intl/server";
import { AdminTable, AdminTableRow } from "@/components/site/AdminTable";
import { Badge, type BadgeStatus } from "@/components/ui/Badge";
import { getPrograms } from "@/lib/queries";

const GRID = "2fr 1fr 1fr 1fr 1fr 90px";

export default async function AdminProgramsPage() {
  const [t, tStatus, programs] = await Promise.all([
    getTranslations("admin.programs"),
    getTranslations("status"),
    getPrograms(),
  ]);

  return (
    <main className="p-8">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="font-serif text-[26px] font-semibold">{t("title")}</h1>
        <div className="cursor-pointer rounded-md bg-ink px-4.5 py-2.5 text-[13px] font-bold text-white">
          {t("newJornada")}
        </div>
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
            <span className="cursor-pointer font-bold text-blue">{t("edit")}</span>
          </AdminTableRow>
        ))}
      </AdminTable>
    </main>
  );
}
