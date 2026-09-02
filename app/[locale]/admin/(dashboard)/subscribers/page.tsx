import { getTranslations, getLocale } from "next-intl/server";
import { Card } from "@/components/ui/Card";
import { StatTile } from "@/components/ui/StatTile";
import { AdminTable, AdminTableRow } from "@/components/site/AdminTable";
import { getSubscribers } from "@/lib/queries";
import { toIntlLocale } from "@/lib/format";

const GRID = "1.5fr 1.5fr 1fr 1fr";

export default async function AdminSubscribersPage() {
  const [t, locale, subscribers] = await Promise.all([
    getTranslations("admin.subscribers"),
    getLocale(),
    getSubscribers(),
  ]);
  const intlLocale = toIntlLocale(locale);

  return (
    <main className="p-8">
      <h1 className="mb-5 font-serif text-[26px] font-semibold">{t("title")}</h1>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <StatTile variant="card" value={String(subscribers.length)} label={t("totalSubscribers")} />
        </Card>
      </div>

      <AdminTable columns={[t("colEmail"), t("colName"), t("colSource"), t("colDate")]} gridTemplate={GRID}>
        {subscribers.map((s) => (
          <AdminTableRow key={s.id} gridTemplate={GRID}>
            <span className="font-semibold">{s.email}</span>
            <span className="text-muted-2">{s.name || "—"}</span>
            <span className="text-muted-2">{s.source}</span>
            <span className="text-muted-2">
              {new Date(s.created_at).toLocaleDateString(intlLocale, { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </AdminTableRow>
        ))}
      </AdminTable>
    </main>
  );
}
