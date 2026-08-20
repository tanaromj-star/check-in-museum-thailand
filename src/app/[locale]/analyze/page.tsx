"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRef, useState } from "react";

type Status = "idle" | "analyzing" | "done" | "error";

export default function AnalyzePage() {
  const t = useTranslations("analyze");
  const locale = useLocale();

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  function handleFileSelected(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setImageDataUrl(result);
        setAnalysis(null);
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
    setAnalysis(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageDataUrl, locale }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Request failed");
      }
      setAnalysis(data.analysis);
      setStatus("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setStatus("error");
    }
  }

  function onReset() {
    setImageDataUrl(null);
    setAnalysis(null);
    setStatus("idle");
    setError(null);
    if (cameraInputRef.current) cameraInputRef.current.value = "";
    if (galleryInputRef.current) galleryInputRef.current.value = "";
  }

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

        {/* Analysis result */}
        {status === "analyzing" && (
          <div className="mt-6 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
            <div className="flex items-center gap-2 text-zinc-500">
              <span className="inline-block h-4 w-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
              {t("analyzing")}
            </div>
          </div>
        )}

        {status === "done" && analysis && (
          <div className="mt-6 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
            <h2 className="font-semibold text-sm text-zinc-500 uppercase tracking-wide">
              {t("result")}
            </h2>
            <div className="mt-2 text-base leading-relaxed whitespace-pre-wrap">
              {analysis}
            </div>
          </div>
        )}

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
