import { getTranslations, getLocale } from "next-intl/server";
import { Card } from "@/components/ui/Card";
import { StatTile } from "@/components/ui/StatTile";
import { AdminTable, AdminTableRow } from "@/components/site/AdminTable";
import { getDonations } from "@/lib/queries";
import { formatCents, toIntlLocale } from "@/lib/format";

const GRID = "1.5fr 1fr 1fr 1fr";

export default async function AdminDonationsPage() {
  const [t, tKind, locale, donations] = await Promise.all([
    getTranslations("admin.donations"),
    getTranslations("donationKind"),
    getLocale(),
    getDonations(),
  ]);
  const intlLocale = toIntlLocale(locale);

  const now = new Date();
  const thisYear = donations.filter((d) => new Date(d.created_at).getFullYear() === now.getFullYear());
  const totalThisYearCents = thisYear.reduce((sum, d) => sum + d.amount_cents, 0);
  const recurringDonors = new Set(
    donations.filter((d) => d.kind !== "one_time").map((d) => d.donor_email),
  ).size;
  const averageGiftCents = donations.length
    ? Math.round(donations.reduce((sum, d) => sum + d.amount_cents, 0) / donations.length)
    : 0;

  return (
    <main className="p-8">
      <h1 className="mb-5 font-serif text-[26px] font-semibold">{t("title")}</h1>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <StatTile variant="card" value={formatCents(totalThisYearCents, intlLocale)} label={t("totalThisYear")} />
        </Card>
        <Card>
          <StatTile variant="card" value={String(recurringDonors)} label={t("recurringDonors")} />
        </Card>
        <Card>
          <StatTile variant="card" value={formatCents(averageGiftCents, intlLocale)} label={t("averageGift")} />
        </Card>
      </div>

      <AdminTable columns={[t("colDonor"), t("colAmount"), t("colType"), t("colDate")]} gridTemplate={GRID}>
        {donations.map((d) => (
          <AdminTableRow key={d.id} gridTemplate={GRID}>
            <span className="font-semibold">{d.donor_name}</span>
            <span>{formatCents(d.amount_cents, intlLocale)}</span>
            <span className="text-muted-2">{tKind(d.kind)}</span>
            <span className="text-muted-2">
              {new Date(d.created_at).toLocaleDateString(intlLocale, { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </AdminTableRow>
        ))}
      </AdminTable>
    </main>
  );
}
