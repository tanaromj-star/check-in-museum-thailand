import { setRequestLocale, getTranslations } from "next-intl/server";
import { SupabaseHealthCheck } from "@/components/supabase-health-check";
import { Link } from "@/i18n/navigation";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();

  return (
    <main className="flex flex-1 flex-col px-4 py-8">
      <div className="w-full max-w-2xl mx-auto">
        {/* Hero */}
        <div className="text-center py-8">
          <div className="text-5xl mb-4">🏛️🎫</div>
          <h1 className="text-3xl font-semibold leading-tight tracking-tight">
            {t("home.title")}
          </h1>
          <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400">
            {t("home.subtitle")}
          </p>
        </div>

        {/* Feature cards */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {/* Museums */}
          <Link
            href="/museums"
            className="group flex flex-col rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 transition-all hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-md"
          >
            <span className="text-3xl">🏛️</span>
            <h2 className="mt-3 font-semibold text-lg group-hover:underline">
              {t("nav.museums")}
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              {t("home.browseMuseums")}
            </p>
          </Link>

          {/* AI Analyze */}
          <Link
            href="/analyze"
            className="group flex flex-col rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 transition-all hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-md"
          >
            <span className="text-3xl">📸</span>
            <h2 className="mt-3 font-semibold text-lg group-hover:underline">
              {t("nav.analyze")}
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              {t("home.analyzePhoto")}
            </p>
          </Link>

          {/* Passport */}
          <Link
            href="/passport"
            className="group flex flex-col rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-zinc-900 dark:to-zinc-950 p-5 transition-all hover:border-amber-400 dark:hover:border-amber-700 hover:shadow-md"
          >
            <span className="text-3xl">🎫</span>
            <h2 className="mt-3 font-semibold text-lg group-hover:underline">
              {t("nav.passport")}
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              {t("home.viewPassport")}
            </p>
          </Link>

          {/* Supabase status */}
          <div className="flex flex-col rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5">
            <span className="text-3xl">🔌</span>
            <h2 className="mt-3 font-semibold text-lg">
              {t("supabase.status")}
            </h2>
            <div className="mt-2">
              <SupabaseHealthCheck />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
