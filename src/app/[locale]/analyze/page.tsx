"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { getMuseumById, museumCategories } from "@/data/museums";
import { analyzeMuseumPhoto, isAIConfigured, type AnalysisResult, type Confidence } from "@/lib/ai-client";

type Status = "idle" | "analyzing" | "done" | "error";

export default function AnalyzePage() {
  const t = useTranslations("analyze");
  const locale = useLocale() as "th" | "en";

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  function handleFileSelected(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const r = reader.result;
      if (typeof r === "string") {
        setImageDataUrl(r);
        setResult(null);
        setStatus("idle");
        setError(null);
      }
    };
    reader.readAsDataURL(file);
  }

  function onCameraClick() {
    cameraInputRef.current?.click();
  }

  function onGalleryClick() {
    galleryInputRef.current?.click();
  }

  async function onAnalyze() {
    if (!imageDataUrl) return;
    setStatus("analyzing");
    setError(null);
    setResult(null);

    if (!isAIConfigured()) {
      setError(t("errorHint"));
      setStatus("error");
      return;
    }

    try {
      const data = await analyzeMuseumPhoto(imageDataUrl, locale);
      setResult(data);
      setStatus("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setStatus("error");
    }
  }

  function onReset() {
    setImageDataUrl(null);
    setResult(null);
    setStatus("idle");
    setError(null);
    if (cameraInputRef.current) cameraInputRef.current.value = "";
    if (galleryInputRef.current) galleryInputRef.current.value = "";
  }

  const matchedMuseum = result?.museumId ? getMuseumById(result.museumId) : null;

  const confidenceColor: Record<Confidence, string> = {
    high: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    low: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    none: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  };

  const confidenceLabel: Record<Confidence, string> = {
    high: t("confidenceHigh"),
    medium: t("confidenceMedium"),
    low: t("confidenceLow"),
    none: t("confidenceNone"),
  };

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">{t("subtitle")}</p>

        {/* Hidden file inputs */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileSelected(file);
          }}
        />
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileSelected(file);
          }}
        />

        {/* Image preview or placeholder */}
        <div className="mt-6">
          {imageDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageDataUrl}
              alt={t("title")}
              className="w-full max-h-80 object-contain rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-48 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 text-center px-4">
              <p className="text-zinc-500 font-medium">{t("noImage")}</p>
              <p className="mt-1 text-sm text-zinc-400">{t("noImageHint")}</p>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="mt-4 flex flex-wrap gap-3">
          {!imageDataUrl && (
            <>
              <button
                onClick={onCameraClick}
                className="flex h-12 items-center justify-center rounded-full bg-foreground px-6 text-background transition-colors hover:opacity-90"
              >
                {t("takePhoto")}
              </button>
              <button
                onClick={onGalleryClick}
                className="flex h-12 items-center justify-center rounded-full border border-solid border-zinc-300 px-6 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900"
              >
                {t("uploadPhoto")}
              </button>
            </>
          )}

          {imageDataUrl && status !== "analyzing" && status !== "done" && (
            <button
              onClick={onAnalyze}
              className="flex h-12 items-center justify-center rounded-full bg-foreground px-6 text-background transition-colors hover:opacity-90"
            >
              {t("analyze")}
            </button>
          )}

          {status === "analyzing" && (
            <button
              disabled
              className="flex h-12 items-center justify-center rounded-full bg-foreground px-6 text-background opacity-60"
            >
              <span className="inline-block h-4 w-4 mr-2 border-2 border-background border-t-transparent rounded-full animate-spin" />
              {t("analyzing")}
            </button>
          )}

          {status === "done" && (
            <button
              onClick={onReset}
              className="flex h-12 items-center justify-center rounded-full border border-solid border-zinc-300 px-6 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              {t("tryAgain")}
            </button>
          )}
        </div>

        {/* Loading state */}
        {status === "analyzing" && (
          <div className="mt-6 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
            <div className="flex items-center gap-2 text-zinc-500">
              <span className="inline-block h-4 w-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
              {t("analyzing")}
            </div>
          </div>
        )}

        {/* Result: AI analysis text */}
        {status === "done" && result?.analysis && (
          <div className="mt-6 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
            <h2 className="font-semibold text-sm text-zinc-500 uppercase tracking-wide">
              {t("result")}
            </h2>
            <div className="mt-2 text-base leading-relaxed whitespace-pre-wrap">
              {result.analysis}
            </div>
          </div>
        )}

        {/* Result: matched museum card */}
        {status === "done" && matchedMuseum && (
          <div className="mt-4 rounded-xl border border-foreground/20 bg-zinc-50 dark:bg-zinc-900/50 p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-sm text-zinc-500 uppercase tracking-wide">
                {t("matchedMuseum")}
              </h2>
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full ${confidenceColor[result?.confidence ?? "none"]}`}
              >
                {t("confidence")}: {confidenceLabel[result?.confidence ?? "none"]}
              </span>
            </div>
            <h3 className="mt-2 text-lg font-semibold">
              {locale === "th" ? matchedMuseum.name_thai : matchedMuseum.name_english}
            </h3>
            <p className="mt-0.5 text-sm text-zinc-500">
              {locale === "th"
                ? matchedMuseum.province_thai
                : matchedMuseum.province_english}
              {" · "}
              {museumCategories[matchedMuseum.category][locale]}
            </p>
            <Link
              href={`/museums/${matchedMuseum.id}`}
              className="mt-3 inline-flex h-10 items-center justify-center rounded-full bg-foreground px-5 text-sm text-background transition-colors hover:opacity-90"
            >
              {t("viewMuseum")}
            </Link>
          </div>
        )}

        {/* Result: no museum matched */}
        {status === "done" && !matchedMuseum && result?.confidence === "none" && (
          <div className="mt-4 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 text-center">
            <p className="text-sm text-zinc-500">{t("noMatch")}</p>
          </div>
        )}

        {/* Error state */}
        {status === "error" && (
          <div className="mt-6 rounded-xl border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-4">
            <p className="font-medium text-red-700 dark:text-red-400">{t("error")}</p>
            <p className="mt-1 text-sm text-red-600 dark:text-red-500">{error ?? t("errorHint")}</p>
          </div>
        )}
      </div>
    </main>
  );
}
