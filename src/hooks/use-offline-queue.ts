"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Offline pending check-in queue using IndexedDB.
 *
 * When a Visitor scans a Museum's QR code while offline, the check-in is
 * queued here. When connectivity returns, pending check-ins are synced
 * (written to localStorage via the usePassport hook, which awards the
 * Stamp if it was the first visit). Sync is idempotent — a Museum+Visitor
 * pair is deduplicated.
 *
 * See the "Pending check-in" term in CONTEXT.md and ADR-0003 (PWA +
 * offline-first). In Phase 2, "sync" will mean posting to Supabase; the
 * queue interface stays the same.
 */

const DB_NAME = "museum-passport";
const DB_VERSION = 1;
const STORE_NAME = "pending-checkins";

export interface PendingCheckIn {
  /** Unique key — the museum id (dedup on this) */
  museumId: string;
  timestamp: string;
  gpsLat?: number;
  gpsLng?: number;
  flagged?: boolean;
}

// --- IndexedDB helpers ---

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "museumId" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function dbGetAll(): Promise<PendingCheckIn[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result as PendingCheckIn[]);
    req.onerror = () => reject(req.error);
  });
}

async function dbPut(item: PendingCheckIn): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    // put() overwrites if the key (museumId) already exists — idempotent
    store.put(item);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function dbDelete(museumId: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.delete(museumId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// --- Hook ---

export function useOfflineQueue() {
  const [pending, setPending] = useState<PendingCheckIn[]>([]);
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true,
  );

  // Load pending check-ins on mount.
  useEffect(() => {
    dbGetAll().then(setPending).catch(() => setPending([]));
  }, []);

  // Track online/offline status.
  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  /** Queue a check-in for later sync. Idempotent — same museumId overwrites. */
  const enqueue = useCallback(async (item: PendingCheckIn) => {
    await dbPut(item);
    setPending(await dbGetAll());
  }, []);

  /** Sync all pending check-ins to the passport (localStorage).
   *  Returns the museum IDs that were synced. */
  const sync = useCallback(
    async (checkInFn: (museumId: string) => void): Promise<string[]> => {
      const all = await dbGetAll();
      const synced: string[] = [];
      for (const item of all) {
        checkInFn(item.museumId);
        await dbDelete(item.museumId);
        synced.push(item.museumId);
      }
      setPending(await dbGetAll());
      return synced;
    },
    [],
  );

  /** Remove a pending check-in (e.g. after successful sync). */
  const remove = useCallback(async (museumId: string) => {
    await dbDelete(museumId);
    setPending(await dbGetAll());
  }, []);

  const pendingCount = pending.length;

  return {
    pending,
    pendingCount,
    isOnline,
    enqueue,
    sync,
    remove,
  };
}
