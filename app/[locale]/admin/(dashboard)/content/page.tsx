import { getTranslations } from "next-intl/server";
import { AdminTable, AdminTableRow } from "@/components/site/AdminTable";
import { Badge, type BadgeStatus } from "@/components/ui/Badge";
import { getAllPosts } from "@/lib/queries";

const GRID = "2fr 1fr 1fr 1fr 90px";

export default async function AdminContentPage() {
  const [t, tStatus, posts] = await Promise.all([
    getTranslations("admin.content"),
    getTranslations("status"),
    getAllPosts(),
  ]);

  return (
    <main className="p-8">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="font-serif text-[26px] font-semibold">{t("title")}</h1>
        <div className="cursor-pointer rounded-md bg-ink px-4.5 py-2.5 text-[13px] font-bold text-white">
          {t("newPost")}
        </div>
      </div>
      <AdminTable columns={[t("colTitle"), t("colType"), t("colAuthor"), t("colStatus"), ""]} gridTemplate={GRID}>
        {posts.map((p) => (
          <AdminTableRow key={p.id} gridTemplate={GRID}>
            <span className="font-semibold">{p.title}</span>
            <span className="text-muted-2">{p.type === "blog" ? t("typeBlog") : t("typeStory")}</span>
            <span className="text-muted-2">{p.author}</span>
            <Badge status={(p.status === "published" ? "Published" : "Draft") as BadgeStatus}>
              {tStatus(p.status === "published" ? "Published" : "Draft")}
            </Badge>
            <span className="cursor-pointer font-bold text-blue">{t("edit")}</span>
          </AdminTableRow>
        ))}
      </AdminTable>
    </main>
  );
}
