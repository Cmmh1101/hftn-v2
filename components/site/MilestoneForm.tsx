import { getTranslations } from "next-intl/server";
import { Input, Label } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import type { ImpactMilestone } from "@/lib/types";

export async function MilestoneForm({
  action,
  milestone,
}: {
  action: (formData: FormData) => void;
  milestone?: ImpactMilestone;
}) {
  const [t, tForm] = await Promise.all([
    getTranslations("admin.milestones"),
    getTranslations("admin.form"),
  ]);

  return (
    <form action={action} className="flex max-w-xl flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>{t("fieldPeriod")}</Label>
          <Input name="period" defaultValue={milestone?.period} placeholder="2021" required className="w-full" />
        </div>
        <div>
          <Label>{t("fieldArea")}</Label>
          <Input name="area" defaultValue={milestone?.area} placeholder="Alimentación" required className="w-full" />
        </div>
      </div>
      <div>
        <Label>{t("fieldImpactValue")}</Label>
        <Input
          name="impact_value"
          defaultValue={milestone?.impact_value}
          placeholder="3,000 platos de sopa"
          required
          className="w-full"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>{t("fieldSortOrder")}</Label>
          <Input type="number" name="sort_order" defaultValue={milestone?.sort_order ?? 0} className="w-full" />
        </div>
        <label className="mt-6 flex items-center gap-2 text-sm">
          <input type="checkbox" name="is_goal" defaultChecked={milestone?.is_goal} /> {t("fieldIsGoal")}
        </label>
      </div>
      <div className="mt-2 flex gap-3">
        <Button type="submit" variant="primary">
          {tForm("save")}
        </Button>
        <Button href="/admin/impact-milestones" variant="outline">
          {tForm("cancel")}
        </Button>
      </div>
    </form>
  );
}
