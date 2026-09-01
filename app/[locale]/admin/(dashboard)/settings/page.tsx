import { getTranslations } from "next-intl/server";
import { Input, Label } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getSiteSettings } from "@/lib/queries";
import { getPublicUrl } from "@/lib/storage";
import { updateSiteSettings } from "./actions";

export default async function AdminSettingsPage() {
  const [t, tForm, settings] = await Promise.all([
    getTranslations("admin.settings"),
    getTranslations("admin.form"),
    getSiteSettings(),
  ]);

  const REPORTS = [
    { key: "annual_report", pathField: "annual_report_path" as const, label: t("reportAnnual") },
    { key: "form_990", pathField: "form_990_path" as const, label: t("reportForm990") },
    { key: "letter_501c3", pathField: "letter_501c3_path" as const, label: t("reportLetter501c3") },
  ];

  return (
    <main className="p-8">
      <h1 className="mb-2 font-serif text-[26px] font-semibold">{t("title")}</h1>
      <p className="mb-6 max-w-xl text-sm text-muted-2">{t("intro")}</p>

      <form action={updateSiteSettings} className="flex max-w-xl flex-col gap-6">
        <Card className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t("fieldCountries")}</Label>
              <Input name="countries_served" defaultValue={settings.countries_served} className="w-full" />
            </div>
            <div>
              <Label>{t("fieldJornadas")}</Label>
              <Input name="jornadas_completed" defaultValue={settings.jornadas_completed} className="w-full" />
            </div>
          </div>
          <div>
            <Label>{t("fieldScholarships")}</Label>
            <Input name="scholarships_stat" defaultValue={settings.scholarships_stat} className="w-full" />
          </div>
          <div>
            <Label>{t("fieldFamilies")}</Label>
            <Input name="families_reached" defaultValue={settings.families_reached} className="w-full" />
          </div>
          <div>
            <Label>{t("fieldDeployed")}</Label>
            <Input name="total_deployed" defaultValue={settings.total_deployed} className="w-full" />
          </div>
        </Card>

        <Card className="flex flex-col gap-4">
          <h2 className="font-serif text-lg font-semibold">{t("reportsTitle")}</h2>
          {REPORTS.map((r) => {
            const currentPath = settings[r.pathField];
            const currentUrl = getPublicUrl(currentPath);
            return (
              <div key={r.key}>
                <Label>{r.label}</Label>
                {currentUrl ? (
                  <div className="mb-1.5 flex items-center gap-3">
                    <a href={currentUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-blue">
                      {t("viewCurrent")}
                    </a>
                    <label className="flex items-center gap-1.5 text-xs text-muted">
                      <input type="checkbox" name={`remove_${r.key}`} /> {tForm("removeFile")}
                    </label>
                  </div>
                ) : (
                  <p className="mb-1.5 text-xs italic text-label">{t("noFileYet")}</p>
                )}
                <Input type="file" name={`${r.key}_file`} accept="application/pdf" className="w-full" />
              </div>
            );
          })}
        </Card>

        <div className="flex gap-3">
          <Button type="submit" variant="primary">
            {tForm("save")}
          </Button>
        </div>
      </form>
    </main>
  );
}
