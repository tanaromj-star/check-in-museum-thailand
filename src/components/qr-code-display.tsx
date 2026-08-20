"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Link } from "@/i18n/navigation";

/**
 * Client-side QR code display + print button.
 * The QR is generated via canvas (compatible with static export).
 */
export function QRCodeDisplay({
  museumId,
  name,
  altName,
  province,
  backText,
  printText,
  scanText,
  instructionsText,
}: {
  museumId: string;
  name: string;
  altName: string;
  province: string;
  backText: string;
  printText: string;
  scanText: string;
  instructionsText: string;
}) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  // The QR encodes a check-in URL. The scan flow (ticket #10) reads this.
  const checkInUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${
          process.env.NEXT_PUBLIC_BASE_PATH ?? ""
        }/?checkin=${museumId}`
      : `/?checkin=${museumId}`;

  useEffect(() => {
    QRCode.toDataURL(checkInUrl, {
      width: 512,
      margin: 2,
      errorCorrectionLevel: "M",
      color: { dark: "#000000", light: "#ffffff" },
    })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(null));
  }, [checkInUrl]);

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-8">
      <div className="w-full max-w-md mx-auto">
        {/* Screen header (hidden on print) */}
        <div className="no-print flex items-center justify-between mb-6">
          <Link
            href="/museums"
            className="text-sm text-zinc-500 hover:text-foreground transition-colors"
          >
            ← {backText}
          </Link>
          <button
            onClick={() => window.print()}
            className="inline-flex h-10 items-center justify-center rounded-full bg-foreground px-5 text-sm text-background transition-colors hover:opacity-90"
          >
            🖨️ {printText}
          </button>
        </div>

        {/* Printable card */}
        <div className="qr-card flex flex-col items-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white p-8 text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
            {scanText}
          </p>

          <div className="my-6">
            {qrDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrDataUrl}
                alt={`QR Code for ${name}`}
                className="w-64 h-64"
              />
            ) : (
              <div className="w-64 h-64 bg-zinc-100 animate-pulse rounded" />
            )}
          </div>

          <h1 className="text-xl font-semibold">{name}</h1>
          <p className="mt-1 text-sm text-zinc-500">{altName}</p>
          <p className="mt-2 text-sm text-zinc-400">{province}</p>

          <div className="mt-6 border-t border-zinc-200 pt-4">
            <p className="text-xs text-zinc-400 max-w-xs">
              {instructionsText}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
