import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Photo } from "@/components/ui/Photo";
import { getPostBySlug } from "@/lib/queries";
import { formatPostDate, toIntlLocale } from "@/lib/format";

export default async function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [t, locale, post] = await Promise.all([
    getTranslations("stories"),
    getLocale(),
    getPostBySlug(slug),
  ]);

  if (!post) notFound();

  const intlLocale = toIntlLocale(locale);

  return (
    <main className="mx-auto max-w-[760px] px-8 pb-20 pt-14">
      <Link href="/stories" className="text-sm font-semibold text-blue">
        ← {t("backToStories")}
      </Link>

      <div className="mt-6">
        {post.category ? (
          <span className="text-xs font-bold tracking-wide text-blue">{post.category.toUpperCase()}</span>
        ) : null}
        <h1 className="mt-2 font-serif text-[34px] font-semibold leading-tight">{post.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-2">
          {post.author ? <span>{post.author}</span> : null}
          {post.author && post.published_at ? <span>·</span> : null}
          {post.published_at ? <span>{formatPostDate(post.published_at, intlLocale)}</span> : null}
        </div>
      </div>

      {post.photo_path ? (
        <Photo path={post.photo_path} alt={post.title} aspect="16/9" rounded="10px" className="my-8" />
      ) : null}

      <div className="article-body" dangerouslySetInnerHTML={{ __html: post.body }} />

      {post.tags.length > 0 ? (
        <div className="mt-10 flex flex-wrap gap-2 border-t border-border-soft pt-6">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-surface-soft-2 px-3 py-1 text-xs font-semibold text-muted-2">
              #{tag}
            </span>
          ))}
        </div>
      ) : null}
    </main>
  );
}
