import { getTranslations } from "next-intl/server";
import { Input, Textarea, Select, Label } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import type { Post } from "@/lib/types";

export async function PostForm({ action, post }: { action: (formData: FormData) => void; post?: Post }) {
  const [t, tStatus, tForm] = await Promise.all([
    getTranslations("admin.content"),
    getTranslations("status"),
    getTranslations("admin.form"),
  ]);

  return (
    <form action={action} className="flex max-w-xl flex-col gap-4">
      <div>
        <Label>{t("colTitle")}</Label>
        <Input name="title" defaultValue={post?.title} required className="w-full" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>{t("colType")}</Label>
          <Select name="type" defaultValue={post?.type ?? "blog"} required className="w-full">
            <option value="blog">{t("typeBlog")}</option>
            <option value="story">{t("typeStory")}</option>
          </Select>
        </div>
        <div>
          <Label>{t("colStatus")}</Label>
          <Select name="status" defaultValue={post?.status ?? "draft"} required className="w-full">
            <option value="draft">{tStatus("Draft")}</option>
            <option value="published">{tStatus("Published")}</option>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>{t("colAuthor")}</Label>
          <Input name="author" defaultValue={post?.author} className="w-full" />
        </div>
        <div>
          <Label>{t("fieldTag")}</Label>
          <Input name="tag" defaultValue={post?.tag} className="w-full" />
        </div>
      </div>
      <div>
        <Label>{t("fieldPublishedAt")}</Label>
        <Input type="date" name="published_at" defaultValue={post?.published_at ?? undefined} className="w-full" />
      </div>
      <div>
        <Label>{t("fieldBody")}</Label>
        <Textarea name="body" defaultValue={post?.body} rows={6} className="w-full" />
      </div>
      <div>
        <Label>{tForm("photo")}</Label>
        {post?.photo_path ? (
          <div className="mb-2 flex items-center gap-3">
            <Photo path={post.photo_path} alt={post.title} aspect="1" rounded="6px" className="w-20" />
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
        <Button href="/admin/content" variant="outline">
          {tForm("cancel")}
        </Button>
      </div>
    </form>
  );
}
