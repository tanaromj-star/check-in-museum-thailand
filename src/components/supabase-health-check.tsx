"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";

type Status = "checking" | "connected" | "disconnected";

/**
 * Pings the configured Supabase project to confirm the client is wired up.
 * Shows disconnected if env vars are not set (e.g. before a project is linked).
 */
export function SupabaseHealthCheck() {
  const t = useTranslations("supabase");
  const configured = (() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return !!url && url.includes("supabase.co");
  })();
  const [status, setStatus] = useState<Status>(configured ? "checking" : "disconnected");

  useEffect(() => {
    if (!configured) return;
    let cancelled = false;
    const supabase = createClient();
    // A lightweight probe — selecting from a table that may not exist yet is
    // fine; we only care that the client reaches the project.
    (async () => {
      try {
        const { error } = await supabase
          .from("_health_check")
          .select("*", { count: "exact", head: true });
        if (cancelled) return;
        // A "relation does not exist" error still means we reached Supabase.
        const reached = !error || /does not exist|relation/i.test(error.message);
        setStatus(reached ? "connected" : "disconnected");
      } catch {
        if (!cancelled) setStatus("disconnected");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [configured]);

  return (
    <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
      <span
        className={`inline-block h-2.5 w-2.5 rounded-full ${
          status === "connected"
            ? "bg-green-500"
            : status === "disconnected"
              ? "bg-red-500"
              : "bg-yellow-500 animate-pulse"
        }`}
      />
      {t("status")}: {status === "connected" ? t("connected") : status === "disconnected" ? t("disconnected") : "…"}
    </div>
  );
}
