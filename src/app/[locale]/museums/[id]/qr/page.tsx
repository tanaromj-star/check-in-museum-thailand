import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { getMuseumById, museums } from "@/data/museums";
import { routing } from "@/i18n/routing";
import { QRCodeDisplay } from "@/components/qr-code-display";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    museums.map((m) => ({ locale, id: m.id })),
  );
}

export default async function QRCodePage({
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
  const altName = isThai ? museum.name_english : museum.name_thai;
  const province = isThai ? museum.province_thai : museum.province_english;

  return (
    <QRCodeDisplay
      museumId={museum.id}
      name={name}
      altName={altName}
      province={province}
      backText={t("back")}
      printText={t("printQR")}
      scanText={t("scanToCheckIn")}
      instructionsText={t("qrInstructions")}
    />
  );
}
