import { getTranslations } from "next-intl/server";
import { Input, Textarea, Select, Label } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { ActionForm, SubmitButton } from "@/components/site/ActionForm";
import type { ActionResult } from "@/lib/action-result";
import { Photo } from "@/components/ui/Photo";
import { LocaleTabs } from "@/components/site/LocaleTabs";
import type { Leader } from "@/lib/types";

export async function LeaderForm({
  action,
  leader,
}: {
  action: (formData: FormData) => Promise<ActionResult | void>;
  leader?: Leader;
}) {
  const [t, tForm, tBi] = await Promise.all([
    getTranslations("admin.leadership"),
    getTranslations("admin.form"),
    getTranslations("admin.bilingual"),
  ]);

  // A person's name is the same in both languages; role and bio are translated.
  const languagePanel = (lang: "en" | "es") => {
    const suffix = lang === "es" ? "_es" : "";
    const isEs = lang === "es";
    return (
      <>
        <div>
          <Label>{t("colRole")}</Label>
          <Input name={`role${suffix}`} defaultValue={(isEs ? leader?.role_es : leader?.role) ?? ""} data-primary className="w-full" />
        </div>
        <div>
          <Label>{t("fieldBio")}</Label>
          <Textarea name={`bio${suffix}`} defaultValue={(isEs ? leader?.bio_es : leader?.bio) ?? ""} rows={5} className="w-full" />
        </div>
      </>
    );
  };

  return (
    <ActionForm action={action} className="flex max-w-2xl flex-col gap-4">
      <div>
        <Label>{t("colName")}</Label>
        <Input name="name" defaultValue={leader?.name} required className="w-full" />
      </div>
      <div>
        <Label>{t("fieldTeam")}</Label>
        <Select name="team" defaultValue={leader?.team ?? "leadership"} className="w-full">
          <option value="leadership">{t("teamLeadership")}</option>
          <option value="outreach">{t("teamOutreach")}</option>
        </Select>
        <p className="mt-1 text-[13px] text-label">{t("fieldTeamHint")}</p>
      </div>
      <LocaleTabs
        missingLabel={tBi("missing")}
        hint={tBi("hint")}
        panels={{ en: languagePanel("en"), es: languagePanel("es") }}
      />
      <div>
        <Label>{t("fieldSortOrder")}</Label>
        <Input type="number" name="sort_order" defaultValue={leader?.sort_order ?? 0} className="w-full" />
      </div>
      <div>
        <Label>{tForm("photo")}</Label>
        {leader?.photo_path ? (
          <div className="mb-2 flex items-center gap-3">
            <Photo path={leader.photo_path} alt={leader.name} aspect="1" rounded="6px" className="w-20" />
            <label className="flex items-center gap-2 text-[13px] text-muted">
              <input type="checkbox" name="removePhoto" /> {tForm("removePhoto")}
            </label>
          </div>
        ) : null}
        <Input type="file" name="photo" accept="image/png,image/jpeg,image/webp,image/gif" className="w-full" />
        <p className="mt-1 text-[13px] text-label">{tForm("uploadHint")}</p>
      </div>
      <div className="mt-2 flex gap-3">
        <SubmitButton variant="primary">{tForm("save")}</SubmitButton>
        <Button href="/admin/leadership" variant="outline">
          {tForm("cancel")}
        </Button>
      </div>
    </ActionForm>
  );
}
