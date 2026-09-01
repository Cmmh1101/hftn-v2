import { useTranslations } from "next-intl";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { PageIntro } from "@/components/site/PageIntro";
import { ContactForm } from "@/components/site/ContactForm";

export default function ContactPage() {
  const t = useTranslations("contact");

  return (
    <main className="mx-auto max-w-[1240px] px-8 pb-20 pt-14">
      <PageIntro eyebrow={t("eyebrow")} title={t("title")} />

      <div className="grid grid-cols-1 gap-14 md:grid-cols-2">
        <ContactForm />
        <div className="flex flex-col gap-5">
          <div>
            <div className="text-xs font-bold tracking-wide text-label">{t("emailLabel")}</div>
            <div className="mt-1 text-[15px]">admin@hopeforthenations7.org</div>
          </div>
          <div>
            <div className="text-xs font-bold tracking-wide text-label">{t("hqLabel")}</div>
            <div className="mt-1 text-[15px]">{t("hqValue")}</div>
          </div>
          <PhotoPlaceholder aspect="16/9" label={t("map")} />
        </div>
      </div>
    </main>
  );
}
