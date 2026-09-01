import { getTranslations } from "next-intl/server";
import { AdminTable, AdminTableRow } from "@/components/site/AdminTable";
import { Badge, type BadgeStatus } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DeleteButton } from "@/components/site/DeleteButton";
import { getAllPosts } from "@/lib/queries";
import { deletePost } from "./actions";

const GRID = "2fr 1fr 1fr 1fr 140px";

export default async function AdminContentPage() {
  const [t, tStatus, tForm, posts] = await Promise.all([
    getTranslations("admin.content"),
    getTranslations("status"),
    getTranslations("admin.form"),
    getAllPosts(),
  ]);

  return (
    <main className="p-8">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="font-serif text-[26px] font-semibold">{t("title")}</h1>
        <Button href="/admin/content/new" variant="primary" size="sm">
          {t("newPost")}
        </Button>
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
            <div className="flex gap-3">
              <Button href={`/admin/content/${p.id}/edit`} variant="link" size="sm">
                {t("edit")}
              </Button>
              <DeleteButton
                action={deletePost}
                confirmMessage={tForm("confirmDelete")}
                label={tForm("delete")}
                confirmLabel={tForm("confirmYes")}
                cancelLabel={tForm("cancel")}
                hiddenFields={{ id: p.id }}
              />
            </div>
          </AdminTableRow>
        ))}
      </AdminTable>
    </main>
  );
}
