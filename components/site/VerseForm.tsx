import { getTranslations } from "next-intl/server";
import { Input, Textarea, Label } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { ActionForm, SubmitButton } from "@/components/site/ActionForm";
import { LocaleTabs } from "@/components/site/LocaleTabs";
import type { ActionResult } from "@/lib/action-result";
import type { Verse } from "@/lib/types";

export async function VerseForm({
  action,
  verse,
}: {
  action: (formData: FormData) => Promise<ActionResult | void>;
  verse?: Verse;
}) {
  const [t, tForm, tBi] = await Promise.all([
    getTranslations("admin.verses"),
    getTranslations("admin.form"),
    getTranslations("admin.bilingual"),
  ]);

  const languagePanel = (lang: "en" | "es") => {
    const suffix = lang === "es" ? "_es" : "";
    const isEs = lang === "es";
    return (
      <>
        <div>
          <Label>{t("fieldReference")}</Label>
          <Input
            name={`reference${suffix}`}
            defaultValue={(isEs ? verse?.reference_es : verse?.reference) ?? ""}
            placeholder={isEs ? "Mateo 5:6–9" : "Matthew 5:6–9"}
            data-primary
            className="w-full"
          />
        </div>
        <div>
          <Label>{t("fieldText")}</Label>
          <Textarea name={`text${suffix}`} defaultValue={(isEs ? verse?.text_es : verse?.text) ?? ""} rows={6} className="w-full" />
        </div>
      </>
    );
  };

  return (
    <ActionForm action={action} className="flex max-w-2xl flex-col gap-4">
      <LocaleTabs missingLabel={tBi("missing")} hint={tBi("hint")} panels={{ en: languagePanel("en"), es: languagePanel("es") }} />
      <div>
        <Label>{t("fieldSortOrder")}</Label>
        <Input type="number" name="sort_order" defaultValue={verse?.sort_order ?? 0} className="w-full" />
      </div>
      <label className="flex items-center gap-2.5 text-[15px] font-semibold text-ink">
        <input type="checkbox" name="active" defaultChecked={verse?.active ?? true} className="h-5 w-5" />
        {t("fieldActive")}
      </label>
      <div className="mt-2 flex gap-3">
        <SubmitButton variant="primary">{tForm("save")}</SubmitButton>
        <Button href="/admin/verses" variant="outline">
          {tForm("cancel")}
        </Button>
      </div>
    </ActionForm>
  );
}
