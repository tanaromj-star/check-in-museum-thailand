# Check-in Museum Thailand

A mobile-first, installable PWA that lets visitors check in at museums across Thailand by scanning a QR code at each site, collecting stamps into a personal "museum passport," and earning badges for collection milestones.

Built for tourists and locals; museum staff participate only by posting a QR code. Thai is the default locale, with English available for tourists.

## Tech stack

- **Next.js 16** (App Router, TypeScript, Turbopack) — UI, routing, server components
- **Supabase** (Postgres + Auth + Storage + Edge Functions) — backend, row-level security
- **Tailwind CSS 4** — styling
- **next-intl** — Thai + English internationalisation with locale-prefixed routes
- **Serwist** — installable PWA (web manifest + service worker)
- **@supabase/ssr** — Supabase clients for browser and server components

## Getting started

### Prerequisites

- Node.js 20+ (developed on Node 22)
- A Supabase project — create one at [supabase.com](https://supabase.com)

### Install

```bash
npm install
```

### Configure environment variables

Copy the example env file and fill in your Supabase project credentials:

```bash
cp .env.example .env.local
```

Then edit `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Find these in your Supabase project: **Settings → API**. The `anon` key is safe to expose to the browser — Row Level Security enforces data access. Never use the `service_role` key in client code.

### Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You'll be redirected to `/th` (Thai, the default locale). Switch to English with the language toggle in the header.

The home page shows a Supabase connection status indicator:
- **Green / "Connected"** — env vars are set and the client reached your Supabase project.
- **Red / "Not connected"** — env vars are missing or the client couldn't reach the project. Fix `.env.local` and restart.

### Build for production

```bash
npm run build
npm start
```

### Lint and typecheck

```bash
npm run lint
npx tsc --noEmit
```

## Internationalisation

Two locales are supported, configured in [`src/i18n/routing.ts`](src/i18n/routing.ts):

- `th` (Thai) — **default**
- `en` (English)

Translation messages live in [`messages/th.json`](messages/th.json) and [`messages/en.json`](messages/en.json). Add new keys to both files. Routes are locale-prefixed (`/th/museums`, `/en/museums`); the root `/` redirects to the default locale.

Use the locale-aware `Link`, `useRouter`, and `usePathname` from [`src/i18n/navigation.ts`](src/i18n/navigation.ts) instead of `next/navigation` so the active locale is automatically prepended.

## PWA

The app is an installable PWA:

- **Web manifest** — [`src/app/manifest.ts`](src/app/manifest.ts), served at `/manifest.webmanifest`. Add icon assets to `public/` (see `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` referenced in the manifest).
- **Service worker** — built by Serwist from [`src/app/sw.ts`](src/app/sw.ts), served at `/serwist/sw.js` via the route handler at [`src/app/serwist/[path]/route.ts`](src/app/serwist/[path]/route.ts). Registered client-side by `SerwistProvider` in the layout.

On a phone, "Add to home screen" installs the app and it launches standalone.

## Supabase clients

- **Browser** — [`src/lib/supabase/client.ts`](src/lib/supabase/client.ts): `createClient()` for Client Components.
- **Server** — [`src/lib/supabase/server.ts`](src/lib/supabase/server.ts): `createClient()` (async) for Server Components, Route Handlers, and Server Actions.

## Project structure

```
src/
├── app/
│   ├── [locale]/            # locale-prefixed routes (th, en)
│   │   ├── layout.tsx       # root layout: <html>, NextIntlClientProvider, SerwistProvider
│   │   └── page.tsx         # home page
│   ├── serwist/[path]/route.ts  # service worker route handler
│   ├── sw.ts                # service worker source
│   ├── manifest.ts          # web app manifest
│   └── globals.css
├── components/
│   ├── language-switcher.tsx
│   └── supabase-health-check.tsx
├── i18n/
│   ├── routing.ts           # locales, defaultLocale
│   ├── request.ts           # next-intl request config (loads messages)
│   └── navigation.ts        # locale-aware Link/useRouter/usePathname
├── lib/supabase/
│   ├── client.ts            # browser client
│   └── server.ts            # server client
└── proxy.ts                 # next-intl middleware (locale routing)
messages/
├── th.json
└── en.json
```

## Domain model

See [`CONTEXT.md`](CONTEXT.md) for the domain glossary (Visitor, Museum, Check-in, Stamp, Badge, Passport, QR code, Pending check-in) and [`docs/adr/`](docs/adr/) for architectural decisions:

- [ADR-0001](docs/adr/0001-check-in-via-static-qr-scan.md) — check-in via static QR scan
- [ADR-0002](docs/adr/0002-anonymous-first-identity.md) — anonymous-first visitor identity
- [ADR-0003](docs/adr/0003-tech-stack-nextjs-supabase-pwa.md) — Next.js + Supabase + Tailwind PWA

## Issue tracker

Issues live on [GitHub](https://github.com/tanaromj-star/check-in-museum-thailand/issues). See [`docs/agents/`](docs/agents/) for the agent skills configuration.
