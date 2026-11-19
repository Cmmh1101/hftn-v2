import { getTranslations } from "next-intl/server";
import { ActionForm, SubmitButton } from "@/components/site/ActionForm";
import { Card } from "@/components/ui/Card";
import { Input, Label } from "@/components/ui/Field";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth-rules";
import { createClient } from "@/lib/supabase/server";
import { changePassword, updateProfileName } from "./actions";

export default async function AdminProfilePage() {
  const [t, tRoles, tFeedback] = await Promise.all([
    getTranslations("admin.profile"),
    getTranslations("admin.roles"),
    getTranslations("feedback"),
  ]);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("name, role").eq("id", user?.id ?? "").single();

  return (
    <main className="p-4 sm:p-8">
      <h1 className="font-serif text-[26px] font-semibold">{t("title")}</h1>
      <p className="mt-2 max-w-[560px] text-[15px] leading-relaxed text-muted">{t("intro")}</p>

      <div className="mt-6 grid max-w-[960px] gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-serif text-lg font-semibold">{t("detailsTitle")}</h2>
          <ActionForm action={updateProfileName} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="profile-name">{t("fieldName")}</Label>
              <Input id="profile-name" name="name" defaultValue={profile?.name ?? ""} required className="w-full" autoComplete="name" />
            </div>
            <div>
              <Label htmlFor="profile-email">{t("fieldEmail")}</Label>
              <Input id="profile-email" value={user?.email ?? ""} readOnly className="w-full bg-surface-soft text-muted-2" />
              <p className="mt-1.5 text-[13px] text-label">{t("emailHint")}</p>
            </div>
            <div>
              <Label htmlFor="profile-role">{t("fieldRole")}</Label>
              <Input id="profile-role" value={tRoles(profile?.role ?? "viewer")} readOnly className="w-full bg-surface-soft text-muted-2" />
            </div>
            <div>
              <SubmitButton variant="primary" size="sm" pendingLabel={tFeedback("saving")}>
                {t("saveDetails")}
              </SubmitButton>
            </div>
          </ActionForm>
        </Card>

        <Card>
          <h2 className="mb-1 font-serif text-lg font-semibold">{t("passwordTitle")}</h2>
          <p className="mb-4 text-[14px] text-muted-2">{t("passwordIntro", { min: MIN_PASSWORD_LENGTH })}</p>
          <ActionForm action={changePassword} resetOnSuccess className="flex flex-col gap-4">
            <div>
              <Label htmlFor="profile-password">{t("newPassword")}</Label>
              <Input id="profile-password" type="password" name="password" required minLength={MIN_PASSWORD_LENGTH} autoComplete="new-password" className="w-full" />
            </div>
            <div>
              <Label htmlFor="profile-confirm">{t("confirmPassword")}</Label>
              <Input id="profile-confirm" type="password" name="confirm" required autoComplete="new-password" className="w-full" />
            </div>
            <div>
              <SubmitButton variant="primary" size="sm" pendingLabel={tFeedback("saving")}>
                {t("savePassword")}
              </SubmitButton>
            </div>
          </ActionForm>
        </Card>
      </div>
    </main>
  );
}
