# Tech stack: Next.js + Supabase + Tailwind as an installable PWA

The app is built with Next.js (App Router, TypeScript) on the frontend, Supabase (Postgres + Auth + Storage + Edge Functions) as the backend, and Tailwind for styling, shipped as an installable PWA. No native app in v1.

## Why

**Supabase** is chosen over a custom API + separate Postgres + auth + storage setup because it gives row-level security, auth (including the anonymous → linked-account flow in ADR-0002), and edge functions for QR validation in one lock-in-tier choice. The lock-in is real (Postgres-compatible, but the RLS and edge-function surface is Supabase-specific), so this gets an ADR rather than being a reversible library pick.

**Next.js App Router** over a SPA: server components reduce the JS shipped to a tourist on mobile data, and route-level i18n (Thai + English, per the domain decision) is cleaner than client-side.

**PWA over a native app**: tourists won't install an app for a one- or two-visit trip. Installable PWA gives offline check-in queueing (per the Pending check-in term) and a home-screen icon without app-store friction.

## Consequences

- Offline check-in queueing lives in the browser (IndexedDB via a service worker / workbox); the Edge Function that receives synced check-ins must be **idempotent** — dedup on Museum+Visitor — because the same Pending check-in may arrive twice.
- Supabase RLS policies are the primary access-control layer; there is no separate API auth middleware. A Visitor can read/write only their own Check-ins and Stamps.
- If Supabase lock-in becomes a problem, the Postgres schema ports directly; the RLS policies and Edge Functions are the non-portable parts and would need reimplementation.
