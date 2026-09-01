import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { PostForm } from "@/components/site/PostForm";
import { createClient } from "@/lib/supabase/server";
import { updatePost } from "../../actions";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [t, supabase] = await Promise.all([getTranslations("admin.content"), createClient()]);
  const { data: post } = await supabase.from("posts").select("*").eq("id", id).single();

  if (!post) notFound();

  return (
    <main className="p-8">
      <h1 className="mb-6 font-serif text-[26px] font-semibold">{t("editTitle")}</h1>
      <PostForm action={updatePost.bind(null, id)} post={post} />
    </main>
  );
}
