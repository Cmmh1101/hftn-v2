import { getTranslations } from "next-intl/server";
import { Input, Textarea, Select, Label } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { PROGRAM_REGIONS } from "@/lib/regions";
import { PROGRAM_TYPES } from "@/lib/programTypes";
import type { Program } from "@/lib/types";

export async function ProgramForm({
  action,
  program,
}: {
  action: (formData: FormData) => void;
  program?: Program;
}) {
  const [t, tCategory, tStatus, tRegions, tTypes, tForm] = await Promise.all([
    getTranslations("admin.programs"),
    getTranslations("programCategory"),
    getTranslations("status"),
    getTranslations("regions"),
    getTranslations("programTypes"),
    getTranslations("admin.form"),
  ]);

  return (
    <form action={action} className="flex max-w-xl flex-col gap-4">
      <div>
        <Label>{t("colName")}</Label>
        <Input name="name" defaultValue={program?.name} required className="w-full" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>{t("fieldCategory")}</Label>
          <Select name="category" defaultValue={program?.category ?? "continuous"} required className="w-full">
            <option value="flagship">{tCategory("flagship")}</option>
            <option value="continuous">{tCategory("continuous")}</option>
            <option value="jornada">{tCategory("jornada")}</option>
            <option value="relief">{tCategory("relief")}</option>
          </Select>
        </div>
        <div>
          <Label>{t("colStatus")}</Label>
          <Select name="status" defaultValue={program?.status ?? "Active"} required className="w-full">
            <option value="Active">{tStatus("Active")}</option>
            <option value="Planned">{tStatus("Planned")}</option>
            <option value="Completed">{tStatus("Completed")}</option>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>{t("colType")}</Label>
          <Select name="type" defaultValue={program?.type ?? PROGRAM_TYPES[0].dbValue} required className="w-full">
            {PROGRAM_TYPES.map((pt) => (
              <option key={pt.dbValue} value={pt.dbValue}>
                {tTypes(pt.labelKey)}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label>{t("colRegion")}</Label>
          <Select name="region" defaultValue={program?.region ?? PROGRAM_REGIONS[0].dbValue} required className="w-full">
            {PROGRAM_REGIONS.map((r) => (
              <option key={r.dbValue} value={r.dbValue}>
                {tRegions(r.labelKey)}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>{t("colParticipants")}</Label>
          <Input type="number" min={0} name="participants" defaultValue={program?.participants ?? 0} className="w-full" />
        </div>
        <div>
          <Label>{t("fieldDate")}</Label>
          <Input type="date" name="program_date" defaultValue={program?.program_date ?? ""} className="w-full" />
        </div>
      </div>
      <div>
        <Label>{t("fieldSummary")}</Label>
        <Textarea name="summary" defaultValue={program?.summary} rows={4} className="w-full" />
      </div>
      <div>
        <Label>{t("fieldWebsiteUrl")}</Label>
        <Input
          type="url"
          name="website_url"
          defaultValue={program?.website_url ?? ""}
          placeholder="https://schoolofhopeinternational.org"
          className="w-full"
        />
        <p className="mt-1 text-xs text-label">{t("fieldWebsiteUrlHint")}</p>
      </div>
      <div>
        <Label>{tForm("photo")}</Label>
        {program?.photo_path ? (
          <div className="mb-2 flex items-center gap-3">
            <Photo path={program.photo_path} alt={program.name} aspect="1" rounded="6px" className="w-20" />
            <label className="flex items-center gap-2 text-xs text-muted">
              <input type="checkbox" name="removePhoto" /> {tForm("removePhoto")}
            </label>
          </div>
        ) : null}
        <Input type="file" name="photo" accept="image/png,image/jpeg,image/webp,image/gif" className="w-full" />
        <p className="mt-1 text-xs text-label">{tForm("uploadHint")}</p>
      </div>
      <div className="mt-2 flex gap-3">
        <Button type="submit" variant="primary">
          {tForm("save")}
        </Button>
        <Button href="/admin/programs" variant="outline">
          {tForm("cancel")}
        </Button>
      </div>
    </form>
  );
}
