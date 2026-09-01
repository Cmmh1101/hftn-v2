import { getTranslations } from "next-intl/server";
import { Input, Textarea, Select, Label } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import type { Event } from "@/lib/types";

export async function EventForm({
  action,
  event,
}: {
  action: (formData: FormData) => void;
  event?: Event;
}) {
  const [t, tStatus, tForm] = await Promise.all([
    getTranslations("admin.events"),
    getTranslations("status"),
    getTranslations("admin.form"),
  ]);

  return (
    <form action={action} className="flex max-w-xl flex-col gap-4">
      <div>
        <Label>{t("fieldName")}</Label>
        <Input name="name" defaultValue={event?.name} required className="w-full" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>{t("fieldDate")}</Label>
          <Input type="date" name="event_date" defaultValue={event?.event_date} required className="w-full" />
        </div>
        <div>
          <Label>{t("fieldStatus")}</Label>
          <Select name="status" defaultValue={event?.status ?? "Planned"} required className="w-full">
            <option value="Active">{tStatus("Active")}</option>
            <option value="Planned">{tStatus("Planned")}</option>
            <option value="Completed">{tStatus("Completed")}</option>
          </Select>
        </div>
      </div>
      <div>
        <Label>{t("fieldLocation")}</Label>
        <Input name="location" defaultValue={event?.location} className="w-full" />
      </div>
      <div>
        <Label>{t("fieldDescription")}</Label>
        <Textarea name="description" defaultValue={event?.description} rows={3} className="w-full" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>{t("fieldGoal")}</Label>
          <Input
            type="number"
            min={0}
            step="0.01"
            name="goal"
            defaultValue={event ? (event.goal_cents / 100).toFixed(2) : undefined}
            className="w-full"
          />
        </div>
        <div>
          <Label>{t("fieldRaised")}</Label>
          <Input
            type="number"
            min={0}
            step="0.01"
            name="raised"
            defaultValue={event ? (event.raised_cents / 100).toFixed(2) : undefined}
            className="w-full"
          />
        </div>
      </div>
      <div>
        <Label>{t("fieldCtaLabel")}</Label>
        <Input name="cta_label" defaultValue={event?.cta_label ?? "Register"} className="w-full" />
      </div>
      <div>
        <Label>{tForm("photo")}</Label>
        {event?.photo_path ? (
          <div className="mb-2 flex items-center gap-3">
            <Photo path={event.photo_path} alt={event.name} aspect="1" rounded="6px" className="w-20" />
            <label className="flex items-center gap-2 text-xs text-muted">
              <input type="checkbox" name="removePhoto" /> {tForm("removePhoto")}
            </label>
          </div>
        ) : null}
        <Input type="file" name="photo" accept="image/png,image/jpeg,image/webp,image/gif" className="w-full" />
        <p className="mt-1 text-xs text-label">{tForm("uploadHint")}</p>
      </div>
      <div className="mt-2 flex gap-3">
        <Button type="submit" variant="primary">
          {tForm("save")}
        </Button>
        <Button href="/admin/events" variant="outline">
          {tForm("cancel")}
        </Button>
      </div>
    </form>
  );
}
