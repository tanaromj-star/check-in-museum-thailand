"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Local-first passport: tracks visited museums in localStorage.
 *
 * No backend required — the visitor "checks in" by tapping a button on a
 * museum's detail page. When Supabase auth lands (ADR-0002), this local
 * state can be synced to the cloud and merged across devices.
 *
 * Uses useSyncExternalStore for SSR-safe localStorage access (no hydration
 * mismatch, no setState-in-effect lint violation).
 *
 * Stored shape: { "museum-id-1": "2025-01-15T...", "museum-id-2": "..." }
 * — keys are museum ids, values are ISO timestamps of the check-in.
 */

const STORAGE_KEY = "museum-passport-visits";

type Visits = Record<string, string>;

const EMPTY_VISITS: Visits = {};

function readVisits(): Visits {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Visits) : {};
  } catch {
    return {};
  }
}

function writeVisits(visits: Visits) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(visits));
  } catch {
    // localStorage might be unavailable (private mode) — fail silently.
  }
}

// --- useSyncExternalStore plumbing ---

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  // Cross-tab sync: another tab's write should update this tab.
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) callback();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): Visits {
  return readVisits();
}

function getServerSnapshot(): Visits {
  return EMPTY_VISITS;
}

function notifyListeners() {
  listeners.forEach((l) => l());
}

// --- Public hook ---

export function usePassport() {
  const visits = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const checkIn = useCallback((museumId: string) => {
    const current = readVisits();
    if (current[museumId]) return; // already visited
    writeVisits({ ...current, [museumId]: new Date().toISOString() });
    notifyListeners();
  }, []);

  const removeVisit = useCallback((museumId: string) => {
    const current = readVisits();
    if (!current[museumId]) return;
    const next = { ...current };
    delete next[museumId];
    writeVisits(next);
    notifyListeners();
  }, []);

  const hasVisited = useCallback(
    (museumId: string) => !!visits[museumId],
    [visits],
  );

  const visitDate = useCallback(
    (museumId: string) => visits[museumId] ?? null,
    [visits],
  );

  const visitCount = Object.keys(visits).length;

  // "loaded" means we're on the client (non-empty snapshot or window exists).
  const loaded = typeof window !== "undefined";

  return {
    visits,
    visitCount,
    loaded,
    checkIn,
    removeVisit,
    hasVisited,
    visitDate,
  };
}
