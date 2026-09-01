import { getTranslations } from "next-intl/server";
import { PostForm } from "@/components/site/PostForm";
import { createPost } from "../actions";

export default async function NewPostPage() {
  const t = await getTranslations("admin.content");

  return (
    <main className="p-8">
      <h1 className="mb-6 font-serif text-[26px] font-semibold">{t("newTitle")}</h1>
      <PostForm action={createPost} />
    </main>
  );
}
