"use client";

import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import {
  museums,
  museumCategories,
  getProvinces,
  type MuseumCategory,
} from "@/data/museums";
import { Link } from "@/i18n/navigation";

export default function MuseumsPage() {
  const t = useTranslations("museums");
  const locale = useLocale() as "th" | "en";
  const provinces = useMemo(() => getProvinces(), []);

  const [search, setSearch] = useState("");
  const [provinceFilter, setProvinceFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const filtered = useMemo(() => {
    return museums.filter((m) => {
      // Text search across both languages
      const q = search.toLowerCase().trim();
      if (q) {
        const haystack = `${m.name_thai} ${m.name_english} ${m.province_thai} ${m.province_english}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (provinceFilter && m.province_english !== provinceFilter) return false;
      if (categoryFilter && m.category !== categoryFilter) return false;
      return true;
    });
  }, [search, provinceFilter, categoryFilter]);

  const categories = Object.keys(museumCategories) as MuseumCategory[];

  return (
    <main className="flex flex-1 flex-col px-4 py-8">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">{t("subtitle")}</p>

        {/* Search + filters */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="flex-1 h-11 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 text-sm outline-none focus:ring-2 focus:ring-foreground/20"
          />
          <select
            value={provinceFilter}
            onChange={(e) => setProvinceFilter(e.target.value)}
            className="h-11 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 text-sm outline-none focus:ring-2 focus:ring-foreground/20"
          >
            <option value="">{t("allProvinces")}</option>
            {provinces.map((p) => (
              <option key={p.english} value={p.english}>
                {locale === "th" ? p.thai : p.english}
              </option>
            ))}
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-11 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 text-sm outline-none focus:ring-2 focus:ring-foreground/20"
          >
            <option value="">{t("allCategories")}</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {museumCategories[c][locale]}
              </option>
            ))}
          </select>
        </div>

        <p className="mt-4 text-sm text-zinc-500">
          {t("museumCount", { count: filtered.length })}
        </p>

        {/* Museum cards */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {filtered.map((m) => (
            <Link
              key={m.id}
              href={`/museums/${m.id}`}
              className="group flex flex-col rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 transition-colors hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-900"
            >
              <h2 className="font-semibold text-base leading-snug group-hover:underline">
                {locale === "th" ? m.name_thai : m.name_english}
              </h2>
              <p className="mt-1 text-xs text-zinc-500">
                {locale === "th" ? m.province_thai : m.province_english} ·{" "}
                {museumCategories[m.category][locale]}
              </p>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                {locale === "th" ? m.description_thai : m.description_english}
              </p>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-12 text-center text-zinc-500">{t("noResults")}</p>
        )}
      </div>
    </main>
  );
}
