"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Field";
import { Photo } from "@/components/ui/Photo";
import { Spinner } from "@/components/ui/Spinner";
import { useToast } from "@/components/ui/Toast";
import { DeleteButton } from "@/components/site/DeleteButton";
import { resizeImage } from "@/lib/resize-image";
import type { ActionResult } from "@/lib/action-result";

type PhotoRow = { id: string; storage_path: string; caption: string };

// Photos of one program. Files are shrunk in the browser and sent one at a
// time, so a dozen phone photos upload reliably and the editor sees progress.
export function ProgramPhotosManager({
  programId,
  programName,
  photos,
  addPhoto,
  deletePhoto,
}: {
  programId: string;
  programName: string;
  photos: PhotoRow[];
  addPhoto: (programId: string, formData: FormData) => Promise<ActionResult>;
  deletePhoto: (formData: FormData) => Promise<ActionResult>;
}) {
  const t = useTranslations("admin.programPhotos");
  const tForm = useTranslations("admin.form");
  const tFeedback = useTranslations("feedback");
  const toast = useToast();
  const router = useRouter();
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (progress) return;
    const form = event.currentTarget;
    const files = Array.from((form.elements.namedItem("files") as HTMLInputElement | null)?.files ?? []);
    if (files.length === 0) {
      toast.error(t("chooseFiles"));
      return;
    }
    const values = new FormData(form);
    const caption = String(values.get("caption") ?? "");
    const caption_es = String(values.get("caption_es") ?? "");

    let uploaded = 0;
    let firstError: string | null = null;
    setProgress({ done: 0, total: files.length });
    for (const file of files) {
      try {
        const fd = new FormData();
        fd.set("photo", await resizeImage(file));
        fd.set("caption", caption);
        fd.set("caption_es", caption_es);
        const result = await addPhoto(programId, fd);
        if (result.ok) uploaded += 1;
        else firstError ??= result.error;
      } catch {
        firstError ??= tFeedback("errorGeneric");
      }
      setProgress((p) => (p ? { ...p, done: p.done + 1 } : p));
    }
    setProgress(null);
    if (uploaded > 0) {
      toast.success(t("uploaded", { count: uploaded }));
      form.reset();
      router.refresh();
    }
    if (firstError) toast.error(firstError);
  }

  return (
    <section className="mt-10 max-w-2xl border-t border-border pt-8" aria-labelledby="program-photos-heading">
      <h2 id="program-photos-heading" className="font-serif text-xl font-semibold">
        {t("title")}
      </h2>
      <p className="mt-1.5 text-[14px] text-label">{t("hint")}</p>

      {photos.length > 0 ? (
        <ul role="list" className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {photos.map((p) => (
            <li key={p.id} className="flex flex-col gap-2">
              <Photo path={p.storage_path} alt={p.caption || programName} aspect="4/3" rounded="8px" sizes="200px" />
              {p.caption ? <span className="line-clamp-2 text-[13px] text-muted-2">{p.caption}</span> : null}
              <DeleteButton
                action={deletePhoto}
                confirmMessage={tForm("confirmDelete")}
                label={tForm("delete")}
                confirmLabel={tForm("confirmYes")}
                cancelLabel={tForm("cancel")}
                hiddenFields={{ id: p.id }}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-5 text-[15px] italic text-label">{t("empty")}</p>
      )}

      <form onSubmit={onSubmit} aria-busy={progress !== null} className="mt-6 flex flex-col gap-4 rounded-lg border border-border bg-surface-soft p-4">
        <div>
          <Label>{t("files")}</Label>
          <Input name="files" type="file" accept="image/png,image/jpeg,image/webp" multiple className="w-full bg-surface" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label>{t("captionEn")}</Label>
            <Input name="caption" className="w-full bg-surface" />
          </div>
          <div>
            <Label>{t("captionEs")}</Label>
            <Input name="caption_es" className="w-full bg-surface" />
          </div>
        </div>
        <p className="text-[13px] text-label">{t("captionHint")}</p>
        <div>
          <Button type="submit" variant="primary" disabled={progress !== null}>
            {progress ? (
              <>
                <Spinner />
                {t("uploading", { done: progress.done, total: progress.total })}
              </>
            ) : (
              t("upload")
            )}
          </Button>
        </div>
      </form>
    </section>
  );
}
