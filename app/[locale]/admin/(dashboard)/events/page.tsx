import { getTranslations, getLocale } from "next-intl/server";
import { Card } from "@/components/ui/Card";
import { Badge, type BadgeStatus } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { DeleteButton } from "@/components/site/DeleteButton";
import { getEvents } from "@/lib/queries";
import { formatCents, toIntlLocale } from "@/lib/format";
import { deleteEvent } from "./actions";

export default async function AdminEventsPage() {
  const [t, tStatus, tForm, locale, events] = await Promise.all([
    getTranslations("admin.events"),
    getTranslations("status"),
    getTranslations("admin.form"),
    getLocale(),
    getEvents(),
  ]);
  const intlLocale = toIntlLocale(locale);

  return (
    <main className="p-8">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="font-serif text-[26px] font-semibold">{t("title")}</h1>
        <Button href="/admin/events/new" variant="primary" size="sm">
          {t("newEvent")}
        </Button>
      </div>
      <div className="flex flex-col gap-3.5">
        {events.map((e) => {
          const pct = e.goal_cents > 0 ? Math.round((e.raised_cents / e.goal_cents) * 100) : 0;
          return (
            <Card key={e.id} className="grid grid-cols-1 items-center gap-5 sm:grid-cols-[2fr_1fr_1fr_auto]">
              <div>
                <div className="text-[14.5px] font-bold">{e.name}</div>
                <div className="mt-1 text-[12.5px] text-muted-2">
                  {e.event_date} · {e.location}
                </div>
              </div>
              <div>
                <div className="mb-1.5 text-[11.5px] text-muted-2">
                  {t("raisedOf", {
                    raised: formatCents(e.raised_cents, intlLocale),
                    goal: formatCents(e.goal_cents, intlLocale),
                  })}
                </div>
                <ProgressBar percent={pct} color="accent" />
              </div>
              <Badge status={e.status as BadgeStatus}>{tStatus(e.status)}</Badge>
              <div className="flex gap-3">
                <Button href={`/admin/events/${e.id}/edit`} variant="link" size="sm">
                  {t("manage")}
                </Button>
                <DeleteButton
                  action={deleteEvent}
                  confirmMessage={tForm("confirmDelete")}
                  label={tForm("delete")}
                  hiddenFields={{ id: e.id }}
                />
              </div>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
