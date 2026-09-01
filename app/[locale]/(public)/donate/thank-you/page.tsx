import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";

export default function DonateThankYouPage() {
  const t = useTranslations("donateThankYou");

  return (
    <main className="mx-auto flex max-w-[640px] flex-col items-center px-8 py-24 text-center">
      <span className="text-xs font-bold uppercase tracking-[2px] text-blue">{t("eyebrow")}</span>
      <h1 className="mt-3.5 font-serif text-[36px] font-semibold">{t("title")}</h1>
      <p className="mt-4 text-[15px] leading-relaxed text-muted">{t("body")}</p>
      <Button href="/" variant="primary" className="mt-7">
        {t("backHome")}
      </Button>
    </main>
  );
}
