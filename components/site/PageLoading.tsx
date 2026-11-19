import { getTranslations } from "next-intl/server";
import { Spinner } from "@/components/ui/Spinner";

// Shown by Next while the next page is being fetched, so a click always
// produces immediate visible feedback instead of a frozen screen. The header,
// footer and admin sidebar stay on screen; only the page body is swapped.
export async function PageLoading({ padded = true }: { padded?: boolean }) {
  const t = await getTranslations("feedback");
  return (
    <div
      role="status"
      aria-live="polite"
      className={padded ? "mx-auto w-full max-w-[1240px] px-5 pb-16 pt-12 sm:px-8 sm:pt-14" : "w-full p-4 sm:p-8"}
    >
      <div className="mb-8 flex items-center gap-3 text-[15px] font-semibold text-muted-2">
        <Spinner className="h-5 w-5 text-blue" />
        {t("loading")}
      </div>
      <div aria-hidden className="animate-pulse space-y-4">
        <div className="h-4 w-32 rounded bg-surface-soft-2" />
        <div className="h-10 w-2/3 max-w-md rounded bg-surface-soft-2" />
        <div className="h-4 w-full max-w-xl rounded bg-surface-soft-2" />
        <div className="h-4 w-5/6 max-w-xl rounded bg-surface-soft-2" />
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="h-48 rounded-lg bg-surface-soft-2" />
          <div className="hidden h-48 rounded-lg bg-surface-soft-2 md:block" />
          <div className="hidden h-48 rounded-lg bg-surface-soft-2 md:block" />
        </div>
      </div>
    </div>
  );
}
