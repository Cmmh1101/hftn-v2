import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { GalleryPhotoForm } from "@/components/site/GalleryPhotoForm";
import { createClient } from "@/lib/supabase/server";
import { updateGalleryPhoto } from "../../actions";

export default async function EditGalleryPhotoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [t, supabase] = await Promise.all([getTranslations("admin.gallery"), createClient()]);
  const { data: photo } = await supabase.from("gallery_photos").select("*").eq("id", id).single();

  if (!photo) notFound();

  return (
    <main className="p-8">
      <h1 className="mb-6 font-serif text-[26px] font-semibold">{t("editTitle")}</h1>
      <GalleryPhotoForm action={updateGalleryPhoto.bind(null, id)} photo={photo} />
    </main>
  );
}
