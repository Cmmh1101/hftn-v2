import { getTranslations } from "next-intl/server";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { getGalleryPhotos } from "@/lib/queries";

export default async function AdminGalleryPage() {
  const [t, photos] = await Promise.all([getTranslations("admin.gallery"), getGalleryPhotos()]);

  return (
    <main className="p-8">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="font-serif text-[26px] font-semibold">{t("title")}</h1>
        <div className="cursor-pointer rounded-md bg-ink px-4.5 py-2.5 text-[13px] font-bold text-white">
          {t("uploadPhotos")}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
        {photos.map((p) => (
          <div key={p.id}>
            <PhotoPlaceholder aspect="1" label="PHOTO" rounded="6px" />
            <div className="mt-1.5 text-[11px] text-muted-2">{p.location}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
