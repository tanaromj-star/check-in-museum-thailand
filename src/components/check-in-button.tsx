"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePassport } from "@/hooks/use-passport";

/**
 * Check-in button for a museum detail page.
 *
 * Shows "Check in here" when not yet visited, or "Checked in" with the
 * date when visited. Toggling removes the check-in (for testing/correction).
 * State persists in localStorage via the usePassport hook.
 */
export function CheckInButton({ museumId }: { museumId: string }) {
  const t = useTranslations("museumDetail");
  const locale = useLocale() as "th" | "en";
  const { hasVisited, visitDate, checkIn, removeVisit, loaded } = usePassport();

  if (!loaded) {
    return (
      <div className="h-11 w-36 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
    );
  }

  const visited = hasVisited(museumId);
  const dateStr = visitDate(museumId);

  if (visited && dateStr) {
    const date = new Date(dateStr).toLocaleDateString(
      locale === "th" ? "th-TH" : "en-US",
      { year: "numeric", month: "long", day: "numeric" },
    );

    return (
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex h-11 items-center gap-2 rounded-full bg-green-600 text-white px-5 text-sm font-medium">
          ✓ {t("checkedIn")}
        </span>
        <span className="text-sm text-zinc-500">{t("checkedInDate", { date })}</span>
        <button
          onClick={() => removeVisit(museumId)}
          className="text-sm text-zinc-400 hover:text-red-500 transition-colors underline-offset-4 hover:underline"
        >
          {t("removeCheckIn")}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => checkIn(museumId)}
      className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-6 text-sm text-background transition-colors hover:opacity-90"
    >
      🏛️ {t("checkIn")}
    </button>
  );
}
