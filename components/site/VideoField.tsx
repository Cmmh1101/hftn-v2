"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { Spinner } from "@/components/ui/Spinner";
import { useToast } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/client";
import { getPublicUrl } from "@/lib/storage";

const MAX_BYTES = 50 * 1024 * 1024; // the media bucket's limit
const TYPES = ["video/mp4", "video/webm"];

/**
 * Video for a post: paste a YouTube link, or upload an MP4/WebM file. The file
 * goes from the browser straight to storage (it is far larger than the app's
 * server accepts) and its address is put in the field.
 */
export function VideoField({ name, defaultValue }: { name: string; defaultValue?: string | null }) {
  const t = useTranslations("admin.content");
  const toast = useToast();
  const [value, setValue] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!TYPES.includes(file.type)) return void toast.error(t("videoBadType"));
    if (file.size > MAX_BYTES) return void toast.error(t("videoTooBig"));

    setUploading(true);
    try {
      const ext = file.type === "video/webm" ? "webm" : "mp4";
      const path = `post-videos/${crypto.randomUUID()}.${ext}`;
      const { error } = await createClient().storage.from("media").upload(path, file, { contentType: file.type });
      if (error) throw error;
      setValue(getPublicUrl(path) ?? "");
      toast.success(t("videoUploaded"));
    } catch {
      toast.error(t("videoUploadFailed"));
    }
    setUploading(false);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <Input
          type="url"
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=…"
          className="min-w-0 flex-1"
        />
        <input ref={fileRef} type="file" accept="video/mp4,video/webm" onChange={onFile} className="sr-only" tabIndex={-1} aria-hidden />
        <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => fileRef.current?.click()}>
          {uploading ? (
            <>
              <Spinner />
              {t("uploadingVideo")}
            </>
          ) : (
            t("uploadVideo")
          )}
        </Button>
      </div>
      {value ? (
        <button type="button" onClick={() => setValue("")} className="mt-2 cursor-pointer text-[13px] font-semibold text-blue">
          {t("removeVideo")}
        </button>
      ) : null}
    </div>
  );
}
