import { getTranslations } from "next-intl/server";
import { AdminTable, AdminTableRow } from "@/components/site/AdminTable";
import { Button } from "@/components/ui/Button";
import { DeleteButton } from "@/components/site/DeleteButton";
import { getVerses } from "@/lib/queries";
import { deleteVerse } from "./actions";

const GRID = "1.2fr 3fr 100px 140px";

export default async function AdminVersesPage() {
  const [t, tForm, tStatus, verses] = await Promise.all([
    getTranslations("admin.verses"),
    getTranslations("admin.form"),
    getTranslations("status"),
    getVerses(undefined, { includeInactive: true }),
  ]);

  return (
    <main className="p-4 sm:p-8">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-[26px] font-semibold">{t("title")}</h1>
        <Button href="/admin/verses/new" variant="primary" size="sm">
          {t("newVerse")}
        </Button>
      </div>
      <p className="mb-5 max-w-2xl text-[15px] text-muted-2">{t("intro")}</p>
      <AdminTable columns={[t("colReference"), t("colText"), t("colStatus"), ""]} gridTemplate={GRID}>
        {verses.map((v) => (
          <AdminTableRow key={v.id} gridTemplate={GRID}>
            <span className="font-semibold">{v.reference || v.reference_es}</span>
            <span className="line-clamp-2 text-muted-2">{v.text || v.text_es}</span>
            <span className="text-muted-2">{v.active ? tStatus("Active") : t("hidden")}</span>
            <div className="flex gap-3">
              <Button href={`/admin/verses/${v.id}/edit`} variant="link" size="sm">
                {t("edit")}
              </Button>
              <DeleteButton
                action={deleteVerse}
                confirmMessage={tForm("confirmDelete")}
                label={tForm("delete")}
                confirmLabel={tForm("confirmYes")}
                cancelLabel={tForm("cancel")}
                hiddenFields={{ id: v.id }}
              />
            </div>
          </AdminTableRow>
        ))}
      </AdminTable>
    </main>
  );
}
