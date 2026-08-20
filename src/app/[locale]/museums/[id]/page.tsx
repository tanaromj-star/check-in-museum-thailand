import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { getMuseumById, museumCategories } from "@/data/museums";
import { Link } from "@/i18n/navigation";
import { CheckInButton } from "@/components/check-in-button";

export default async function MuseumDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("museumDetail");
  const museum = getMuseumById(id);

  if (!museum) {
    notFound();
  }

  const isThai = locale === "th";
  const name = isThai ? museum.name_thai : museum.name_english;
  const description = isThai ? museum.description_thai : museum.description_english;
  const province = isThai ? museum.province_thai : museum.province_english;
  const address = isThai ? museum.address_thai : museum.address_english;
  const categoryLabel = museumCategories[museum.category][isThai ? "th" : "en"];
  const mapsUrl = `https://www.google.com/maps?q=${museum.latitude},${museum.longitude}`;

  return (
    <main className="flex flex-1 flex-col px-4 py-8">
      <div className="w-full max-w-2xl mx-auto">
        <Link
          href={{ pathname: "/museums" }}
          className="inline-flex items-center text-sm text-zinc-500 hover:text-foreground transition-colors"
        >
          ← {t("back")}
        </Link>

        <div className="mt-4 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-zinc-100 to-zinc-50 dark:from-zinc-900 dark:to-zinc-950 p-6">
            <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-foreground text-background">
              {categoryLabel}
            </span>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight">{name}</h1>
            <p className="mt-1 text-sm text-zinc-500">
              {isThai ? museum.name_english : museum.name_thai}
            </p>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">
            {/* Description */}
            <div>
              <p className="text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
                {description}
              </p>
            </div>

            {/* Details grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  {t("province")}
                </dt>
                <dd className="mt-1 text-sm">{province}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  {t("category")}
                </dt>
                <dd className="mt-1 text-sm">{categoryLabel}</dd>
              </div>
              {address && (
                <div className="sm:col-span-2">
                  <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                    {t("address")}
                  </dt>
                  <dd className="mt-1 text-sm">{address}</dd>
                </div>
              )}
              <div className="sm:col-span-2">
                <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  {t("location")}
                </dt>
                <dd className="mt-1 text-sm">
                  {museum.latitude.toFixed(4)}, {museum.longitude.toFixed(4)}
                </dd>
              </div>
            </div>

            {/* Check-in + Map link */}
            <div className="flex flex-wrap items-center gap-3">
              <CheckInButton museumId={museum.id} />
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center rounded-full border border-solid border-zinc-300 dark:border-zinc-700 px-5 text-sm transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900"
              >
                {t("openInMaps")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
