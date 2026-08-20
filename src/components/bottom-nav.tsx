"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { usePassport } from "@/hooks/use-passport";

/**
 * Mobile-first bottom navigation bar.
 * Shows on every page, with an active state for the current section.
 * The Passport tab shows a badge with the number of collected stamps.
 */
export function BottomNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const { visitCount } = usePassport();

  const items = [
    { href: "/", label: t("home"), icon: "🏠", key: "home" },
    { href: "/museums", label: t("museums"), icon: "🏛️", key: "museums" },
    { href: "/analyze", label: t("analyze"), icon: "📸", key: "analyze" },
    { href: "/passport", label: t("passport"), icon: "🎫", key: "passport" },
  ] as const;

  function isActive(href: string, key: string): boolean {
    if (href === "/") return pathname === "/";
    if (key === "museums") return pathname.startsWith("/museums");
    return pathname === href;
  }

  return (
    <nav
      className="sticky bottom-0 z-50 flex items-stretch border-t border-zinc-200 bg-white/95 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95"
      aria-label={t("language")}
    >
      {items.map((item) => {
        const active = isActive(item.href, item.key);
        return (
          <Link
            key={item.key}
            href={item.href}
            className={`relative flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors ${
              active
                ? "text-foreground"
                : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            }`}
          >
            <span className="text-xl leading-none">
              {item.icon}
            </span>
            <span>{item.label}</span>
            {/* Active indicator */}
            {active && (
              <span className="absolute top-0 h-0.5 w-8 rounded-full bg-foreground" />
            )}
            {/* Passport stamp badge */}
            {item.key === "passport" && visitCount > 0 && (
              <span className="absolute right-1/2 translate-x-3 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[9px] font-bold text-white">
                {visitCount}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
