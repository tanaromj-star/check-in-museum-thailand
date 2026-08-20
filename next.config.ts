import type { NextConfig } from "next";
import { withSerwist } from "@serwist/turbopack";
import createNextIntlPlugin from "next-intl/plugin";

// When NEXT_PUBLIC_BASE_PATH is set (GitHub Actions CI), use static export.
// In local dev, no base path → middleware works normally for i18n routing.
const isStaticExport = !!process.env.NEXT_PUBLIC_BASE_PATH;

const nextConfig: NextConfig = {
  // Static export for GitHub Pages only — middleware/proxy can't run on
  // static hosts, so we only enable this in CI builds.
  ...(isStaticExport ? { output: "export" as const } : {}),
  images: { unoptimized: true },
  // GitHub Pages serves at /<repo>/, so assets need the base path.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
};

const withNextIntl = createNextIntlPlugin();

// Serwist wraps the config first (build-time SW compilation), then next-intl.
export default withNextIntl(withSerwist(nextConfig));
