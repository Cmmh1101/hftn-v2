import { getTranslations } from "next-intl/server";
import { Input, Label } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { ActionForm, SubmitButton } from "@/components/site/ActionForm";
import type { ActionResult } from "@/lib/action-result";
import { LocaleTabs } from "@/components/site/LocaleTabs";
import type { ImpactMilestone } from "@/lib/types";

export async function MilestoneForm({
  action,
  milestone,
}: {
  action: (formData: FormData) => Promise<ActionResult | void>;
  milestone?: ImpactMilestone;
}) {
  const [t, tForm, tBi] = await Promise.all([
    getTranslations("admin.milestones"),
    getTranslations("admin.form"),
    getTranslations("admin.bilingual"),
  ]);

  // Area and impact text exist once per language; the period and ordering are shared.
  const languagePanel = (lang: "en" | "es") => {
    const suffix = lang === "es" ? "_es" : "";
    const isEs = lang === "es";
    return (
      <>
        <div>
          <Label>{t("fieldArea")}</Label>
          <Input
            name={`area${suffix}`}
            defaultValue={(isEs ? milestone?.area_es : milestone?.area) ?? ""}
            placeholder={isEs ? "Alimentación" : "Food"}
            data-primary
            className="w-full"
          />
        </div>
        <div>
          <Label>{t("fieldImpactValue")}</Label>
          <Input
            name={`impact_value${suffix}`}
            defaultValue={(isEs ? milestone?.impact_value_es : milestone?.impact_value) ?? ""}
            placeholder={isEs ? "3,000 platos de sopa" : "3,000 bowls of soup"}
            className="w-full"
          />
        </div>
      </>
    );
  };

  return (
    <ActionForm action={action} className="flex max-w-2xl flex-col gap-4">
      <div>
        <Label>{t("fieldPeriod")}</Label>
        <Input name="period" defaultValue={milestone?.period} placeholder="2021" required className="w-full" />
      </div>
      <LocaleTabs
        missingLabel={tBi("missing")}
        hint={tBi("hint")}
        panels={{ en: languagePanel("en"), es: languagePanel("es") }}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label>{t("fieldSortOrder")}</Label>
          <Input type="number" name="sort_order" defaultValue={milestone?.sort_order ?? 0} className="w-full" />
        </div>
        <label className="mt-6 flex items-center gap-2 text-[15px]">
          <input type="checkbox" name="is_goal" defaultChecked={milestone?.is_goal} /> {t("fieldIsGoal")}
        </label>
      </div>
      <div className="mt-2 flex gap-3">
        <SubmitButton variant="primary">{tForm("save")}</SubmitButton>
        <Button href="/admin/impact-milestones" variant="outline">
          {tForm("cancel")}
        </Button>
      </div>
    </ActionForm>
  );
}
