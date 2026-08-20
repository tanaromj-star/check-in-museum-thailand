"use client";

import { useTranslations } from "next-intl";
import { useEffect, useSyncExternalStore } from "react";
import { usePassport } from "@/hooks/use-passport";
import { useOfflineQueue } from "@/hooks/use-offline-queue";

// Simple external store to track sync state without setState-in-effect.
let syncingVal = false;
const syncListeners = new Set<() => void>();
function subscribeSync(cb: () => void) {
  syncListeners.add(cb);
  return () => syncListeners.delete(cb);
}
function getSyncSnapshot() {
  return syncingVal;
}
function setSyncing(val: boolean) {
  syncingVal = val;
  syncListeners.forEach((l) => l());
}

/**
 * Offline queue sync indicator.
 *
 * Shows pending check-in count and automatically syncs when the device
 * comes back online. Sync calls `checkIn` on the usePassport hook for
 * each pending museum (idempotent — already-visited museums are skipped
 * by the hook).
 */
export function OfflineSyncIndicator() {
  const t = useTranslations("museumDetail");
  const { checkIn } = usePassport();
  const { pendingCount, isOnline, sync } = useOfflineQueue();
  const syncing = useSyncExternalStore(subscribeSync, getSyncSnapshot, () => false);

  useEffect(() => {
    if (isOnline && pendingCount > 0 && !syncing) {
      setSyncing(true);
      sync(checkIn)
        .catch(() => {})
        .finally(() => setSyncing(false));
    }
  }, [isOnline, pendingCount, syncing, sync, checkIn]);

  if (pendingCount === 0 && !syncing) return null;

  return (
    <div className="rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-950/30 p-4">
      {syncing ? (
        <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-400">
          <span className="inline-block h-4 w-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          {t("syncing")}
        </div>
      ) : (
        <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-400">
          📲 {t("pendingCheckins", { count: pendingCount })}
          {!isOnline && (
            <span className="text-xs text-blue-500">({t("offlineQueued")})</span>
          )}
        </div>
      )}
    </div>
  );
}
