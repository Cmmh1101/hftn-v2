import { getTranslations } from "next-intl/server";
import { Photo } from "@/components/ui/Photo";
import { Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DeleteButton } from "@/components/site/DeleteButton";
import { getGalleryPhotos } from "@/lib/queries";
import { uploadGalleryPhoto, deleteGalleryPhoto } from "./actions";

export default async function AdminGalleryPage() {
  const [t, tForm, photos] = await Promise.all([
    getTranslations("admin.gallery"),
    getTranslations("admin.form"),
    getGalleryPhotos(),
  ]);

  return (
    <main className="p-8">
      <h1 className="mb-5 font-serif text-[26px] font-semibold">{t("title")}</h1>

      <Card className="mb-7 max-w-2xl">
        <form action={uploadGalleryPhoto} className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <Input name="location" placeholder={t("fieldLocation")} required />
          <Input name="region" placeholder={t("fieldRegion")} required />
          <Input name="caption" placeholder={t("fieldCaption")} className="sm:col-span-2" />
          <Input
            type="file"
            name="photo"
            accept="image/png,image/jpeg,image/webp,image/gif"
            required
            className="sm:col-span-2"
          />
          <Button type="submit" variant="primary" className="w-fit">
            {t("upload")}
          </Button>
        </form>
      </Card>

      <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
        {photos.map((p) => (
          <div key={p.id}>
            <Photo path={p.storage_path} alt={p.location} aspect="1" rounded="6px" />
            <div className="mt-1.5 text-[11px] text-muted-2">{p.location}</div>
            <DeleteButton
              action={deleteGalleryPhoto}
              confirmMessage={tForm("confirmDelete")}
              label={t("delete")}
              hiddenFields={{ id: p.id }}
              className="text-[11px]"
            />
          </div>
        ))}
      </div>
    </main>
  );
}
