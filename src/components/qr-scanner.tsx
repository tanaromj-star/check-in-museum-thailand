"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { museums, getMuseumById } from "@/data/museums";
import { usePassport } from "@/hooks/use-passport";
import { useOfflineQueue } from "@/hooks/use-offline-queue";
import { Link } from "@/i18n/navigation";

type ScanStatus = "idle" | "scanning" | "success" | "already" | "queued" | "error" | "camera-error";

interface ScanResult {
  museumId: string;
  museumName: string;
  alreadyCheckedIn: boolean;
  flagged: boolean;
}

/**
 * In-app QR scanner for museum check-in.
 *
 * Opens the device camera, reads a QR code encoding a check-in URL,
 * extracts the museum id, validates it against the dataset, and calls
 * `checkIn(museumId)` on the usePassport hook. GPS is captured at scan
 * time as a soft fraud signal (flagged if >1km from the museum).
 */
export function QRScanner() {
  const t = useTranslations("museumDetail");
  const { checkIn, hasVisited } = usePassport();
  const { isOnline, enqueue } = useOfflineQueue();

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerId = "qr-scanner-container";
  const isScanningRef = useRef(false);

  const [status, setStatus] = useState<ScanStatus>("idle");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  /** Extract museum id from the scanned QR URL. */
  function extractMuseumId(scannedText: string): string | null {
    try {
      const url = new URL(scannedText);
      const param = url.searchParams.get("checkin");
      if (param) return param;
      // Fallback: last path segment
      const segments = url.pathname.split("/").filter(Boolean);
      return segments[segments.length - 1] ?? null;
    } catch {
      // Not a URL — maybe just a raw museum id
      if (museums.find((m) => m.id === scannedText)) return scannedText;
      return null;
    }
  }

  /** Haversine distance in meters. */
  function distanceMeters(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371000; // Earth radius in meters
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  /** Handle a successful QR scan. */
  async function handleScan(scannedText: string): Promise<boolean> {
    const museumId = extractMuseumId(scannedText);

    if (!museumId) {
      setStatus("error");
      setErrorMsg(t("scanNotFound"));
      stopScanning();
      return true; // stop scanning on result
    }

    const museum = getMuseumById(museumId);
    if (!museum) {
      setStatus("error");
      setErrorMsg(t("scanNotFound"));
      stopScanning();
      return true;
    }

    const already = hasVisited(museumId);

    // Capture GPS as soft fraud signal.
    let flagged = false;
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 5000,
          maximumAge: 60000,
        });
      });
      const dist = distanceMeters(
        pos.coords.latitude,
        pos.coords.longitude,
        museum.latitude,
        museum.longitude,
      );
      if (dist > 1000) flagged = true;
    } catch {
      // GPS unavailable — proceed without flag (no penalty for no signal)
    }

    if (!isOnline) {
      // Offline: queue the check-in for later sync.
      await enqueue({
        museumId,
        timestamp: new Date().toISOString(),
        gpsLat: undefined,
        gpsLng: undefined,
        flagged,
      });
      setResult({
        museumId,
        museumName: museum.name_english,
        alreadyCheckedIn: already,
        flagged,
      });
      setStatus("queued");
      stopScanning();
      return true;
    }

    if (!already) {
      checkIn(museumId);
    }

    setResult({
      museumId,
      museumName: museum.name_english,
      alreadyCheckedIn: already,
      flagged,
    });
    setStatus(already ? "already" : "success");
    stopScanning();
    return true;
  }

  /** Start the camera scanner. */
  async function startScanning() {
    setStatus("scanning");
    setErrorMsg(null);
    setResult(null);

    try {
      const scanner = new Html5Qrcode(containerId);
      scannerRef.current = scanner;
      isScanningRef.current = true;

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          if (isScanningRef.current) {
            handleScan(decodedText);
          }
        },
        () => {
          // Per-frame decode error — ignore, keep scanning
        },
      );
    } catch {
      setStatus("camera-error");
      setErrorMsg(t("cameraError"));
    }
  }

  /** Stop the camera scanner. */
  async function stopScanning() {
    isScanningRef.current = false;
    const scanner = scannerRef.current;
    if (scanner) {
      try {
        await scanner.stop();
        await scanner.clear();
      } catch {
        // Already stopped
      }
      scannerRef.current = null;
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  const matchedMuseum = result ? getMuseumById(result.museumId) : null;

  return (
    <div className="w-full">
      {/* Scanner controls */}
      {(status === "idle" || status === "error" || status === "camera-error") && (
        <button
          onClick={startScanning}
          className="inline-flex h-12 items-center justify-center rounded-full bg-foreground px-6 text-sm text-background transition-colors hover:opacity-90"
        >
          📸 {t("scannerStart")}
        </button>
      )}

      {(status === "scanning" || status === "success" || status === "already" || status === "queued") && (
        <button
          onClick={stopScanning}
          className="inline-flex h-12 items-center justify-center rounded-full border border-solid border-zinc-300 dark:border-zinc-700 px-6 text-sm transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900"
        >
          ⏹️ {t("scannerStop")}
        </button>
      )}

      {/* Camera viewfinder */}
      {status === "scanning" && (
        <div className="mt-4">
          <p className="text-sm text-zinc-500 mb-2">{t("scannerHint")}</p>
          <div
            id={containerId}
            className="w-full max-w-sm rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800"
          />
        </div>
      )}

      {/* Success / already checked in / queued */}
      {(status === "success" || status === "already" || status === "queued") && result && matchedMuseum && (
        <div className="mt-4 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
          <div className="flex items-center gap-3">
            <span className="text-3xl">
              {status === "success" ? "✅" : status === "already" ? "🎫" : "📲"}
            </span>
            <div>
              <p className="font-semibold text-base">
                {status === "success"
                  ? t("scanSuccess")
                  : status === "already"
                    ? t("scanAlready")
                    : t("offlineQueued")}
              </p>
              <p className="text-sm text-zinc-500">
                {t("checkedInAt", { museum: result.museumName })}
              </p>
            </div>
          </div>

          {result.flagged && (
            <p className="mt-3 text-xs text-amber-600 dark:text-amber-500">
              ⚠️ {t("farFromMuseum")}
            </p>
          )}

          <Link
            href={`/museums/${result.museumId}`}
            className="mt-4 inline-flex h-10 items-center justify-center rounded-full bg-foreground px-5 text-sm text-background transition-colors hover:opacity-90"
          >
            {t("qrCode")} →
          </Link>
        </div>
      )}

      {/* Error states */}
      {(status === "error" || status === "camera-error") && errorMsg && (
        <div className="mt-4 rounded-xl border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-4">
          <p className="font-medium text-red-700 dark:text-red-400">{t("scanError")}</p>
          <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errorMsg}</p>
        </div>
      )}
    </div>
  );
}
