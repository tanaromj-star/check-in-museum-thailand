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
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="max-w-md text-3xl font-semibold leading-tight tracking-tight">
        {t("home.title")}
      </h1>
      <p className="mt-4 max-w-md text-lg text-zinc-600 dark:text-zinc-400">
        {t("home.subtitle")}
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href={{ pathname: "/museums" }}
          className="flex h-12 items-center justify-center rounded-full bg-foreground px-6 text-background transition-colors hover:opacity-90"
        >
          {t("home.browseMuseums")}
        </Link>
        <Link
          href={{ pathname: "/passport" }}
          className="flex h-12 items-center justify-center rounded-full border border-solid border-zinc-300 px-6 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900"
        >
          {t("home.viewPassport")}
        </Link>
      </div>
      <div className="mt-4">
        <Link
          href={{ pathname: "/analyze" }}
          className="inline-flex h-10 items-center justify-center rounded-full text-sm font-medium text-zinc-600 dark:text-zinc-400 underline-offset-4 hover:underline"
        >
          {t("home.analyzePhoto")}
        </Link>
      </div>
      <div className="mt-10">
        <SupabaseHealthCheck />
      </div>
    </main>
  );
}
