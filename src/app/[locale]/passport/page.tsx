"use client";

import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { museums, museumCategories } from "@/data/museums";
import { usePassport } from "@/hooks/use-passport";
import { Link } from "@/i18n/navigation";

export default function PassportPage() {
  const t = useTranslations("passport");
  const locale = useLocale() as "th" | "en";
  const { visits, visitCount, loaded, visitDate } = usePassport();
  const [shareMsg, setShareMsg] = useState<string | null>(null);

  const total = museums.length;
  const percent = total > 0 ? Math.round((visitCount / total) * 100) : 0;

  // Visited museums (sorted by check-in date), then unvisited.
  const { visitedMuseums, unvisitedMuseums } = useMemo(() => {
    const visited = museums
      .filter((m) => visits[m.id])
      .sort((a, b) => (visits[a.id] ?? "").localeCompare(visits[b.id] ?? ""));

    const unvisited = museums.filter((m) => !visits[m.id]);

    return { visitedMuseums: visited, unvisitedMuseums: unvisited };
  }, [visits]);

  function onShare() {
    const text = t("shareText", { count: visitCount });
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";

    if (navigator.share) {
      navigator
        .share({ title: t("title"), text, url: shareUrl })
        .catch(() => setShareMsg(t("shareFailed")));
    } else if (navigator.clipboard) {
      navigator.clipboard
        .writeText(`${text} ${shareUrl}`)
        .then(() => setShareMsg(t("shareSuccess")))
        .catch(() => setShareMsg(t("shareFailed")));
    } else {
      setShareMsg(t("shareFailed"));
    }

    // Clear the message after 3 seconds.
    setTimeout(() => setShareMsg(null), 3000);
  }

  if (!loaded) {
    return (
      <main className="flex flex-1 flex-col items-center px-4 py-8">
        <div className="w-full max-w-3xl">
          <div className="h-8 w-48 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-32 rounded-xl bg-zinc-100 dark:bg-zinc-900 animate-pulse"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col px-4 py-8">
      <div className="w-full max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">{t("subtitle")}</p>
          </div>
          {visitCount > 0 && (
            <button
              onClick={onShare}
              className="shrink-0 inline-flex h-10 items-center justify-center rounded-full border border-solid border-zinc-300 dark:border-zinc-700 px-4 text-sm transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              📤 {t("share")}
            </button>
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-6 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-zinc-900 dark:to-zinc-950">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              {t("stampsCollected")}
            </span>
            <span className="text-2xl font-bold">
              {visitCount}
              <span className="text-base text-zinc-400"> / {total}</span>
            </span>
          </div>
          <div className="mt-3 h-3 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-zinc-500">
            {t("progress", { visited: visitCount, total })}
          </p>
        </div>

        {/* Share feedback */}
        {shareMsg && (
          <p className="mt-3 text-sm text-center text-green-600 dark:text-green-400">
            {shareMsg}
          </p>
        )}

        {/* Empty state */}
        {visitCount === 0 ? (
          <div className="mt-8 flex flex-col items-center justify-center text-center py-16 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700">
            <span className="text-5xl"> stamps</span>
            <p className="mt-4 text-lg font-medium text-zinc-500">{t("empty")}</p>
            <p className="mt-1 text-sm text-zinc-400">{t("emptyHint")}</p>
            <Link
              href="/museums"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-foreground px-6 text-sm text-background transition-colors hover:opacity-90"
            >
              {t("browseMuseums")}
            </Link>
          </div>
        ) : (
          <>
            {/* Collected stamps grid */}
            <h2 className="mt-8 text-sm font-semibold text-zinc-500 uppercase tracking-wide">
              {t("stamps")}
            </h2>
            <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visitedMuseums.map((m) => {
                const dateStr = visitDate(m.id);
                const date = dateStr
                  ? new Date(dateStr).toLocaleDateString(
                      locale === "th" ? "th-TH" : "en-US",
                      { year: "numeric", month: "short", day: "numeric" },
                    )
                  : "";

                return (
                  <Link
                    key={m.id}
                    href={`/museums/${m.id}`}
                    className="group flex flex-col rounded-xl border border-amber-200 dark:border-amber-900/50 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-zinc-900 dark:to-zinc-950 p-4 transition-all hover:shadow-md hover:border-amber-400 dark:hover:border-amber-700"
                  >
                    {/* Stamp visual */}
                    <div className="flex items-center justify-center h-16 mb-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-amber-500 dark:border-amber-600 text-2xl">
                        🏛️
                      </div>
                    </div>
                    <h3 className="text-sm font-semibold leading-snug group-hover:underline">
                      {locale === "th" ? m.name_thai : m.name_english}
                    </h3>
                    <p className="mt-1 text-xs text-zinc-500">
                      {locale === "th" ? m.province_thai : m.province_english} ·{" "}
                      {museumCategories[m.category][locale]}
                    </p>
                    {date && (
                      <p className="mt-2 text-xs text-amber-600 dark:text-amber-500">
                        ✓ {t("visitedOn", { date })}
                      </p>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Unvisited museums (dimmed) */}
            {unvisitedMuseums.length > 0 && (
              <>
                <h2 className="mt-8 text-sm font-semibold text-zinc-400 uppercase tracking-wide">
                  {t("notVisited")}
                </h2>
                <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {unvisitedMuseums.map((m) => (
                    <Link
                      key={m.id}
                      href={`/museums/${m.id}`}
                      className="group flex flex-col rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 opacity-60 transition-all hover:opacity-100 hover:border-zinc-400 dark:hover:border-zinc-600"
                    >
                      <div className="flex items-center justify-center h-16 mb-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-zinc-300 dark:border-zinc-700 text-2xl grayscale">
                          🏛️
                        </div>
                      </div>
                      <h3 className="text-sm font-semibold leading-snug group-hover:underline">
                        {locale === "th" ? m.name_thai : m.name_english}
                      </h3>
                      <p className="mt-1 text-xs text-zinc-400">
                        {locale === "th" ? m.province_thai : m.province_english}
                      </p>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}
