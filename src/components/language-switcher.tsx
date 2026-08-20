"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { routing, type Locale } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("language");
  const tNav = useTranslations("nav");
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function onToggle(nextLocale: Locale) {
    if (nextLocale === locale) return;
    startTransition(() => {
      // next-intl's router.replace takes a pathname without the locale prefix
      // and rewrites it for the target locale.
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <div
      className="flex items-center gap-1 text-sm"
      role="group"
      aria-label={tNav("language")}
    >
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => onToggle(loc)}
          disabled={isPending || loc === locale}
          className={`rounded-full px-2.5 py-1 transition-colors ${
            loc === locale
              ? "bg-foreground text-background"
              : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
          }`}
        >
          {t(loc)}
        </button>
      ))}
    </div>
  );
}
