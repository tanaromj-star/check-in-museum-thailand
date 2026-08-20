import { setRequestLocale, getTranslations } from "next-intl/server";
import { QRScanner } from "@/components/qr-scanner";

export default async function ScanPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("museumDetail");

  return (
    <main className="flex flex-1 flex-col px-4 py-8">
      <div className="w-full max-w-md mx-auto">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("scannerTitle")}
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          {t("scannerHint")}
        </p>

        <div className="mt-6">
          <QRScanner />
        </div>
      </div>
    </main>
  );
}
