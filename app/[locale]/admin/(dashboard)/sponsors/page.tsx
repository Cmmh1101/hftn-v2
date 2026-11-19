import { getTranslations } from "next-intl/server";
import { AdminTable, AdminTableRow } from "@/components/site/AdminTable";
import { Button } from "@/components/ui/Button";
import { DeleteButton } from "@/components/site/DeleteButton";
import { getSponsors } from "@/lib/queries";
import { getPublicUrl } from "@/lib/storage";
import { deleteSponsor } from "./actions";

const GRID = "100px 2fr 2fr 110px 140px";

export default async function AdminSponsorsPage() {
  const [t, tForm, tStatus, sponsors] = await Promise.all([
    getTranslations("admin.sponsors"),
    getTranslations("admin.form"),
    getTranslations("status"),
    getSponsors({ includeInactive: true }),
  ]);

  return (
    <main className="p-4 sm:p-8">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-[26px] font-semibold">{t("title")}</h1>
        <Button href="/admin/sponsors/new" variant="primary" size="sm">
          {t("newSponsor")}
        </Button>
      </div>
      <p className="mb-5 max-w-2xl text-[15px] text-muted-2">{t("intro")}</p>
      <AdminTable columns={[t("colLogo"), t("colName"), t("colWebsite"), t("colStatus"), ""]} gridTemplate={GRID}>
        {sponsors.map((s) => {
          const logo = getPublicUrl(s.logo_path);
          return (
            <AdminTableRow key={s.id} gridTemplate={GRID}>
              <span>
                {logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logo} alt="" className="h-10 w-20 rounded border border-border-soft bg-white object-contain p-1" />
                ) : (
                  <span className="text-[13px] text-label">—</span>
                )}
              </span>
              <span className="font-semibold">{s.name}</span>
              <span className="truncate text-muted-2">{s.website_url?.replace(/^https?:\/\//, "") ?? "—"}</span>
              <span className="text-muted-2">{s.active ? tStatus("Active") : t("hidden")}</span>
              <div className="flex gap-3">
                <Button href={`/admin/sponsors/${s.id}/edit`} variant="link" size="sm">
                  {t("edit")}
                </Button>
                <DeleteButton
                  action={deleteSponsor}
                  confirmMessage={tForm("confirmDelete")}
                  label={tForm("delete")}
                  confirmLabel={tForm("confirmYes")}
                  cancelLabel={tForm("cancel")}
                  hiddenFields={{ id: s.id }}
                />
              </div>
            </AdminTableRow>
          );
        })}
      </AdminTable>
    </main>
  );
}
