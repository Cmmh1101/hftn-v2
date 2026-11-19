import { getTranslations } from "next-intl/server";
import { Input, Label } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { ActionForm, SubmitButton } from "@/components/site/ActionForm";
import type { ActionResult } from "@/lib/action-result";
import { getPublicUrl } from "@/lib/storage";
import type { Sponsor } from "@/lib/types";

export async function SponsorForm({
  action,
  sponsor,
}: {
  action: (formData: FormData) => Promise<ActionResult | void>;
  sponsor?: Sponsor;
}) {
  const [t, tForm] = await Promise.all([getTranslations("admin.sponsors"), getTranslations("admin.form")]);
  const logoUrl = getPublicUrl(sponsor?.logo_path);

  return (
    <ActionForm action={action} className="flex max-w-2xl flex-col gap-4">
      <div>
        <Label>{t("colName")}</Label>
        <Input name="name" defaultValue={sponsor?.name} required className="w-full" />
      </div>
      <div>
        <Label>{t("fieldWebsite")}</Label>
        <Input name="website_url" defaultValue={sponsor?.website_url ?? ""} placeholder="https://example.com" className="w-full" />
        <p className="mt-1 text-[13px] text-label">{t("fieldWebsiteHint")}</p>
      </div>
      <div>
        <Label>{t("fieldSortOrder")}</Label>
        <Input type="number" name="sort_order" defaultValue={sponsor?.sort_order ?? 0} className="w-full" />
      </div>
      <label className="flex items-center gap-2.5 text-[15px] font-semibold text-ink">
        <input type="checkbox" name="active" defaultChecked={sponsor?.active ?? true} className="h-5 w-5" />
        {t("fieldActive")}
      </label>
      <div>
        <Label>{t("fieldLogo")}</Label>
        {logoUrl ? (
          <div className="mb-2 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoUrl} alt={sponsor?.name ?? ""} className="h-20 w-32 rounded-md border border-border-soft bg-white object-contain p-2" />
            <label className="flex items-center gap-2 text-[13px] text-muted">
              <input type="checkbox" name="removePhoto" /> {tForm("removePhoto")}
            </label>
          </div>
        ) : null}
        <Input type="file" name="photo" accept="image/png,image/jpeg,image/webp" className="w-full" />
        <p className="mt-1 text-[13px] text-label">{t("fieldLogoHint")}</p>
      </div>
      <div className="mt-2 flex gap-3">
        <SubmitButton variant="primary">{tForm("save")}</SubmitButton>
        <Button href="/admin/sponsors" variant="outline">
          {tForm("cancel")}
        </Button>
      </div>
    </ActionForm>
  );
}
