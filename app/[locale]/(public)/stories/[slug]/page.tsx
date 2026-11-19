import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Photo } from "@/components/ui/Photo";
import { VideoEmbed } from "@/components/ui/VideoEmbed";
import { getPostBySlug } from "@/lib/queries";
import { getVideoPoster } from "@/lib/video";
import { isFallback, localizeRow, toContentLocale } from "@/lib/localize";
import { formatPostDate, toIntlLocale } from "@/lib/format";

export default async function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const contentLocale = await getLocale();
  const { slug } = await params;
  const [t, locale, rawPost] = await Promise.all([getTranslations("stories"), getLocale(), getPostBySlug(slug)]);

  if (!rawPost) notFound();

  // A post may exist in only one language; the visitor then sees it in that
  // language, with a notice, and the article is tagged with its real language.
  const lang = toContentLocale(contentLocale);
  const post = localizeRow(rawPost, ["title", "category", "tags", "body"], lang);
  const showingOtherLanguage = isFallback(rawPost.title, rawPost.title_es, lang);
  const articleLang = showingOtherLanguage ? (lang === "es" ? "en" : "es") : lang;

  const intlLocale = toIntlLocale(locale);
  const videoPoster = post.video_url ? await getVideoPoster(post.video_url) : null;

  return (
    <main className="mx-auto max-w-[760px] px-5 sm:px-8 pb-16 sm:pb-20 pt-10 sm:pt-14">
      <Link href="/stories" className="text-[15px] font-semibold text-blue">
        ← {t("backToStories")}
      </Link>

      {showingOtherLanguage ? (
        <p role="note" className="mt-6 rounded-lg border border-border bg-surface-soft-2 px-4 py-3 text-[15px] text-muted">
          {t(articleLang === "es" ? "onlyInSpanish" : "onlyInEnglish")}
        </p>
      ) : null}

      <div lang={articleLang} className="mt-6">
        {post.category ? (
          <span className="text-[13px] font-bold tracking-wide text-blue">{post.category.toUpperCase()}</span>
        ) : null}
        <h1 className="mt-2 font-serif text-[28px] font-semibold leading-tight sm:text-[34px]">{post.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[15px] text-muted-2">
          {post.author ? <span>{post.author}</span> : null}
          {post.author && post.published_at ? <span>·</span> : null}
          {post.published_at ? <span>{formatPostDate(post.published_at, intlLocale)}</span> : null}
        </div>
      </div>

      {post.video_url ? (
        <VideoEmbed url={post.video_url} title={post.title} poster={videoPoster} className="my-8" />
      ) : post.photo_path ? (
        <Photo path={post.photo_path} alt={post.title} aspect="16/9" rounded="10px" className="my-8" />
      ) : null}

      <div lang={articleLang} className="article-body" dangerouslySetInnerHTML={{ __html: post.body }} />

      {post.tags.length > 0 ? (
        <div lang={articleLang} className="mt-10 flex flex-wrap gap-2 border-t border-border-soft pt-6">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-surface-soft-2 px-3 py-1 text-[13px] font-semibold text-muted-2">
              #{tag}
            </span>
          ))}
        </div>
      ) : null}
    </main>
  );
}
