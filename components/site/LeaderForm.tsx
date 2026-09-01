import { getTranslations } from "next-intl/server";
import { Input, Textarea, Label } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import type { Leader } from "@/lib/types";

export async function LeaderForm({
  action,
  leader,
}: {
  action: (formData: FormData) => void;
  leader?: Leader;
}) {
  const [t, tForm] = await Promise.all([getTranslations("admin.leadership"), getTranslations("admin.form")]);

  return (
    <form action={action} className="flex max-w-xl flex-col gap-4">
      <div>
        <Label>{t("colName")}</Label>
        <Input name="name" defaultValue={leader?.name} required className="w-full" />
      </div>
      <div>
        <Label>{t("colRole")}</Label>
        <Input name="role" defaultValue={leader?.role} className="w-full" />
      </div>
      <div>
        <Label>{t("fieldBio")}</Label>
        <Textarea name="bio" defaultValue={leader?.bio} rows={5} className="w-full" />
      </div>
      <div>
        <Label>{t("fieldSortOrder")}</Label>
        <Input type="number" name="sort_order" defaultValue={leader?.sort_order ?? 0} className="w-full" />
      </div>
      <div>
        <Label>{tForm("photo")}</Label>
        {leader?.photo_path ? (
          <div className="mb-2 flex items-center gap-3">
            <Photo path={leader.photo_path} alt={leader.name} aspect="1" rounded="6px" className="w-20" />
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
        <Button href="/admin/leadership" variant="outline">
          {tForm("cancel")}
        </Button>
      </div>
    </form>
  );
}
