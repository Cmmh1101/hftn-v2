import { getTranslations } from "next-intl/server";
import { Input, Select, Label } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { ActionForm, SubmitButton } from "@/components/site/ActionForm";
import type { ActionResult } from "@/lib/action-result";
import { Photo } from "@/components/ui/Photo";
import { GALLERY_REGIONS } from "@/lib/regions";
import type { GalleryPhoto } from "@/lib/types";

export async function GalleryPhotoForm({
  action,
  photo,
}: {
  action: (formData: FormData) => Promise<ActionResult | void>;
  photo?: GalleryPhoto;
}) {
  const [t, tRegions, tForm] = await Promise.all([
    getTranslations("admin.gallery"),
    getTranslations("regions"),
    getTranslations("admin.form"),
  ]);

  return (
    <ActionForm action={action} className="flex max-w-xl flex-col gap-4">
      <div>
        <Label>{t("fieldLocation")}</Label>
        <Input name="location" defaultValue={photo?.location} required className="w-full" />
      </div>
      <div>
        <Label>{t("fieldRegion")}</Label>
        <Select name="region" defaultValue={photo?.region} className="w-full">
          {GALLERY_REGIONS.map((r) => (
            <option key={r.dbValue} value={r.dbValue}>
              {tRegions(r.labelKey)}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label>{t("fieldCaption")} — English</Label>
        <Input name="caption" lang="en" defaultValue={photo?.caption ?? ""} className="w-full" />
      </div>
      <div>
        <Label>{t("fieldCaption")} — Español</Label>
        <Input name="caption_es" lang="es" defaultValue={photo?.caption_es ?? ""} className="w-full" />
      </div>
      <div>
        <Label>{tForm("photo")}</Label>
        {photo?.storage_path ? (
          <div className="mb-2">
            <Photo path={photo.storage_path} alt={photo.location} aspect="1" rounded="6px" className="w-28" />
          </div>
        ) : null}
        <Input
          type="file"
          name="photo"
          accept="image/png,image/jpeg,image/webp,image/gif"
          required={!photo}
          className="w-full"
        />
        <p className="mt-1 text-[13px] text-label">{tForm("uploadHint")}</p>
      </div>
      <div className="mt-2 flex gap-3">
        <SubmitButton variant="primary">{tForm("save")}</SubmitButton>
        <Button href="/admin/gallery" variant="outline">
          {tForm("cancel")}
        </Button>
      </div>
    </ActionForm>
  );
}
