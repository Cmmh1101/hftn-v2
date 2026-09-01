import { getTranslations, getLocale } from "next-intl/server";
import { Card } from "@/components/ui/Card";
import { StatTile } from "@/components/ui/StatTile";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { getDonationsByMonth, getDonationsThisMonthCents, getEvents, getPrograms, getRecentActivity } from "@/lib/queries";
import { formatCents, formatEventMonth, formatEventDay, toIntlLocale } from "@/lib/format";

export default async function AdminOverviewPage() {
  const locale = await getLocale();
  const intlLocale = toIntlLocale(locale);
  const [t, tRegions, programs, events, donationBars, mtdCents, activity] = await Promise.all([
    getTranslations("admin.overview"),
    getTranslations("regions"),
    getPrograms(),
    getEvents(),
    getDonationsByMonth(8, intlLocale),
    getDonationsThisMonthCents(),
    getRecentActivity(intlLocale),
  ]);

  const REGION_REACH = [
    { label: tRegions("southAmerica"), pct: 78 },
    { label: tRegions("centralAmerica"), pct: 38 },
    { label: tRegions("northAmerica"), pct: 22 },
    { label: tRegions("europe"), pct: 12 },
  ];

  const flagship = programs.find((p) => p.category === "flagship");
  const activeJornadas = programs.filter((p) => p.status === "Active" && p.category !== "flagship");
  const jornadaRegions = new Set(activeJornadas.map((p) => p.region)).size;
  const nextEvent = events[0];
  const maxCents = Math.max(...donationBars.map((b) => b.cents), 1);

  function activityText(item: Awaited<ReturnType<typeof getRecentActivity>>[number]) {
    switch (item.kind) {
      case "donation":
        return t("activityDonation", { amount: formatCents(item.amountCents, intlLocale), donor: item.donorName });
      case "postPublished":
        return t("activityPostPublished", { title: item.title });
      case "postDrafted":
        return t("activityPostDrafted", { title: item.title });
      case "galleryAdded":
        return t("activityGalleryAdded", { location: item.location });
    }
  }

  return (
    <main className="p-8">
      <h1 className="mb-6 font-serif text-[26px] font-semibold">{t("title")}</h1>

      <div className="mb-7 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatTile variant="card" value={formatCents(mtdCents, intlLocale)} label={t("donationsMtd")} />
        <StatTile
          variant="card"
          value={String(activeJornadas.length)}
          label={t("activeJornadas")}
          trend={t("acrossRegions", { count: jornadaRegions })}
        />
        <StatTile
          variant="card"
          value={(flagship?.participants ?? 0).toLocaleString(intlLocale)}
          label={t("schoolOfHopeStudents")}
        />
        <StatTile
          variant="card"
          value={String(events.length)}
          label={t("upcomingEvents")}
          trend={
            nextEvent
              ? t("next", { date: `${formatEventMonth(nextEvent.event_date, intlLocale)} ${formatEventDay(nextEvent.event_date, intlLocale)}` })
              : undefined
          }
        />
      </div>

      <div className="mb-7 grid grid-cols-1 gap-5 lg:grid-cols-[1.5fr_1fr]">
        <Card>
          <div className="mb-4 text-[13px] font-bold">{t("donationsByMonth")}</div>
          <div className="flex h-[140px] items-end gap-2.5">
            {donationBars.map((b, i) => (
              <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                <div
                  className="w-full rounded-t-[3px] bg-accent"
                  style={{ height: `${Math.max((b.cents / maxCents) * 100, 2)}%` }}
                />
                <span className="text-[10.5px] text-muted-2">{b.label}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <div className="mb-4 text-[13px] font-bold">{t("reachByRegion")}</div>
          <div className="flex flex-col gap-3">
            {REGION_REACH.map((r) => (
              <div key={r.label}>
                <div className="mb-1.5 flex justify-between text-xs">
                  <span>{r.label}</span>
                  <span className="text-muted-2">{r.pct}%</span>
                </div>
                <ProgressBar percent={r.pct} color="blue" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className="mb-3.5 text-[13px] font-bold">{t("recentActivity")}</div>
        {activity.length === 0 ? (
          <p className="py-2 text-sm text-muted-2">{t("noActivity")}</p>
        ) : (
          activity.map((a, i) => (
            <div
              key={i}
              className="flex justify-between border-b border-border-softer py-2.5 text-sm last:border-b-0"
            >
              <span>{activityText(a)}</span>
              <span className="text-muted-2">{a.time}</span>
            </div>
          ))
        )}
      </Card>
    </main>
  );
}
