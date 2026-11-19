import { getTranslations } from "next-intl/server";
import { AdminTable, AdminTableRow } from "@/components/site/AdminTable";
import { Input } from "@/components/ui/Field";
import { ActionForm, SubmitButton } from "@/components/site/ActionForm";
import { RoleSelect } from "@/components/site/RoleSelect";
import { createClient } from "@/lib/supabase/server";
import { getProfiles, getUserAccounts } from "@/lib/queries";
import { getLocale } from "next-intl/server";
import { toIntlLocale } from "@/lib/format";
import { inviteUser, updateUserRole } from "./actions";

const GRID = "1.2fr 1.6fr 1.1fr 1fr";

export default async function AdminUsersPage() {
  const [t, tRoles, tFeedback, profiles, locale] = await Promise.all([
    getTranslations("admin.users"),
    getTranslations("admin.roles"),
    getTranslations("feedback"),
    getProfiles(),
    getLocale(),
  ]);

  // Emails and sign-in dates live in Supabase Auth, read with the service key,
  // so only show them to admins.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const me = profiles.find((p) => p.id === user?.id);
  const isAdmin = me?.role === "admin";
  const accounts = isAdmin ? await getUserAccounts() : new Map();
  const dateFormat = new Intl.DateTimeFormat(toIntlLocale(locale), { month: "short", day: "numeric", year: "numeric" });

  const roleOptions = [
    { value: "admin", label: tRoles("admin") },
    { value: "editor", label: tRoles("editor") },
    { value: "viewer", label: tRoles("viewer") },
  ];

  return (
    <main className="p-4 sm:p-8">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h1 className="font-serif text-[26px] font-semibold">{t("title")}</h1>
        {isAdmin ? (
        <ActionForm action={inviteUser} resetOnSuccess className="flex gap-2">
          <Input type="email" name="email" placeholder={t("invitePlaceholder")} required className="w-56" />
          <SubmitButton variant="primary" size="sm" pendingLabel={tFeedback("sending")}>
            {t("inviteButton")}
          </SubmitButton>
        </ActionForm>
        ) : null}
      </div>
      <AdminTable columns={[t("colName"), t("colEmail"), t("colRole"), t("colLastActive")]} gridTemplate={GRID}>
        {profiles.map((p) => {
          const account = accounts.get(p.id);
          return (
            <AdminTableRow key={p.id} gridTemplate={GRID}>
              <span className="font-semibold">{p.name || "—"}</span>
              <span className="min-w-0 break-words text-muted-2">{account?.email || "—"}</span>
              <RoleSelect action={updateUserRole.bind(null, p.id)} defaultValue={p.role} options={roleOptions} />
              {account?.lastSignInAt ? (
                <span className="text-muted-2">{dateFormat.format(new Date(account.lastSignInAt))}</span>
              ) : account ? (
                <span className="w-fit rounded-full bg-amber-100 px-2.5 py-0.5 text-[12px] font-bold text-amber-900">
                  {t("pendingInvite")}
                </span>
              ) : (
                <span className="text-muted-2">—</span>
              )}
            </AdminTableRow>
          );
        })}
      </AdminTable>
    </main>
  );
}
