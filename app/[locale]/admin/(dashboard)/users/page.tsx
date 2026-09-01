import { getTranslations } from "next-intl/server";
import { AdminTable, AdminTableRow } from "@/components/site/AdminTable";
import { Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { getProfiles } from "@/lib/queries";
import { inviteUser } from "./actions";

const GRID = "1.5fr 1.2fr 1fr 1fr";

export default async function AdminUsersPage() {
  const [t, tRoles, profiles] = await Promise.all([
    getTranslations("admin.users"),
    getTranslations("admin.roles"),
    getProfiles(),
  ]);

  return (
    <main className="p-8">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h1 className="font-serif text-[26px] font-semibold">{t("title")}</h1>
        <form action={inviteUser} className="flex gap-2">
          <Input type="email" name="email" placeholder={t("invitePlaceholder")} required className="w-56" />
          <Button type="submit" variant="primary" size="sm">
            {t("inviteButton")}
          </Button>
        </form>
      </div>
      <AdminTable columns={[t("colName"), t("colRole"), t("colRegion"), t("colLastActive")]} gridTemplate={GRID}>
        {profiles.map((p) => (
          <AdminTableRow key={p.id} gridTemplate={GRID}>
            <span className="font-semibold">{p.name || "—"}</span>
            <span className="text-muted-2">{tRoles(p.role)}</span>
            <span className="text-muted-2">{p.region || "—"}</span>
            <span className="text-muted-2">—</span>
          </AdminTableRow>
        ))}
      </AdminTable>
    </main>
  );
}
