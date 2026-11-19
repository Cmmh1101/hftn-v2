import { getTranslations } from "next-intl/server";
import { Input, Select, Label } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { ActionForm, SubmitButton } from "@/components/site/ActionForm";
import type { ActionResult } from "@/lib/action-result";
import { Photo } from "@/components/ui/Photo";
import { RichTextEditor } from "@/components/site/RichTextEditor";
import { VideoField } from "@/components/site/VideoField";
import { LocaleTabs } from "@/components/site/LocaleTabs";
import type { Post } from "@/lib/types";

export async function PostForm({ action, post }: { action: (formData: FormData) => Promise<ActionResult | void>; post?: Post }) {
  const [t, tStatus, tForm, tBi] = await Promise.all([
    getTranslations("admin.content"),
    getTranslations("status"),
    getTranslations("admin.form"),
    getTranslations("admin.bilingual"),
  ]);

  // Title, category, tags and body exist once per language; everything else
  // (slug, type, status, author, date, photo) is shared by both versions.
  const languagePanel = (lang: "en" | "es") => {
    const suffix = lang === "es" ? "_es" : "";
    const title = lang === "es" ? post?.title_es : post?.title;
    const category = lang === "es" ? post?.category_es : post?.category;
    const tags = lang === "es" ? post?.tags_es : post?.tags;
    const body = lang === "es" ? post?.body_es : post?.body;
    return (
      <>
        <div>
          <Label>{t("colTitle")}</Label>
          <Input name={`title${suffix}`} defaultValue={title ?? ""} data-primary className="w-full" />
        </div>
        <div>
          <Label>{t("fieldCategory")}</Label>
          <Input name={`category${suffix}`} defaultValue={category ?? ""} className="w-full" />
        </div>
        <div>
          <Label>{t("fieldTags")}</Label>
          <Input
            name={`tags${suffix}`}
            defaultValue={tags?.join(", ") ?? ""}
            placeholder={t("fieldTagsPlaceholder")}
            className="w-full"
          />
          <p className="mt-1 text-[13px] text-label">{t("fieldTagsHint")}</p>
        </div>
        <div>
          <Label>{t("fieldBody")}</Label>
          <RichTextEditor name={`body${suffix}`} defaultValue={body ?? ""} placeholder={tBi("bodyPlaceholder")} lang={lang} />
        </div>
      </>
    );
  };

  return (
    <ActionForm action={action} className="flex max-w-3xl flex-col gap-5">
      <LocaleTabs
        panels={{ en: languagePanel("en"), es: languagePanel("es") }}
        missingLabel={tBi("missing")}
        hint={tBi("hint")}
      />
      <div>
        <Label>{t("fieldSlug")}</Label>
        <Input name="slug" defaultValue={post?.slug} placeholder={t("fieldSlugPlaceholder")} className="w-full" />
        <p className="mt-1 text-[13px] text-label">{t("fieldSlugHint")}</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label>{t("colAuthor")}</Label>
          <Input name="author" defaultValue={post?.author} className="w-full" />
        </div>
        <div>
          <Label>{t("fieldPublishedAt")}</Label>
          <Input type="date" name="published_at" defaultValue={post?.published_at ?? undefined} className="w-full" />
        </div>
      </div>
      <div>
        <Label>{t("fieldVideo")}</Label>
        <VideoField name="video_url" defaultValue={post?.video_url} />
        <p className="mt-1 text-[13px] text-label">{t("fieldVideoHint")}</p>
      </div>
      <div>
        <Label>{tForm("photo")}</Label>
        {post?.photo_path ? (
          <div className="mb-2 flex items-center gap-3">
            <Photo path={post.photo_path} alt={post.title || post.title_es || ""} aspect="1" rounded="6px" className="w-20" />
            <label className="flex items-center gap-2 text-[13px] text-muted">
              <input type="checkbox" name="removePhoto" /> {tForm("removePhoto")}
            </label>
          </div>
        ) : null}
        <Input type="file" name="photo" accept="image/png,image/jpeg,image/webp,image/gif" className="w-full" />
        <p className="mt-1 text-[13px] text-label">{tForm("uploadHint")}</p>
      </div>
      <div className="mt-2 flex gap-3">
        <SubmitButton variant="primary">{tForm("save")}</SubmitButton>
        <Button href="/admin/content" variant="outline">
          {tForm("cancel")}
        </Button>
      </div>
    </ActionForm>
  );
}
