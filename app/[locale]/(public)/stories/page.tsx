import { getTranslations, getLocale } from "next-intl/server";
import { Card } from "@/components/ui/Card";
import { Photo } from "@/components/ui/Photo";
import { PageIntro } from "@/components/site/PageIntro";
import { getPublishedPosts } from "@/lib/queries";
import { formatPostDate, toIntlLocale } from "@/lib/format";

export default async function StoriesPage() {
  const [t, locale, stories, posts] = await Promise.all([
    getTranslations("stories"),
    getLocale(),
    getPublishedPosts("story"),
    getPublishedPosts("blog"),
  ]);
  const intlLocale = toIntlLocale(locale);

  return (
    <main className="mx-auto max-w-[1240px] px-8 pb-20 pt-14">
      <PageIntro eyebrow={t("eyebrow")} title={t("title")} />

      <div className="mb-14 grid grid-cols-2 gap-5 md:grid-cols-4">
        {stories.map((s) => (
          <Card key={s.id} padding="none" className="overflow-hidden">
            <Photo path={s.photo_path} alt={s.title} aspect="4/3" label="PHOTO" rounded="0" />
            <div className="p-4.5">
              <div className="text-[14.5px] font-bold">{s.title}</div>
              <div className="mt-1.5 text-[13px] leading-relaxed text-muted-2">{s.body}</div>
            </div>
          </Card>
        ))}
      </div>

      <h2 className="mb-5 border-t border-border pt-11 font-serif text-[26px] font-semibold">{t("fromBlog")}</h2>
      <div className="flex flex-col">
        {posts.map((p) => (
          <div
            key={p.id}
            className="flex items-baseline justify-between gap-4 border-b border-border-soft py-4.5"
          >
            <div>
              <span className="text-[11px] font-bold tracking-wide text-blue">{p.tag}</span>
              <div className="mt-1 font-serif text-lg">{p.title}</div>
            </div>
            <span className="whitespace-nowrap text-xs text-label">
              {formatPostDate(p.published_at, intlLocale)}
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}
