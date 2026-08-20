import type { NextConfig } from "next";
import { withSerwist } from "@serwist/turbopack";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  // Static export for GitHub Pages. The AI analysis runs client-side.
  output: "export",
  images: { unoptimized: true },
  // GitHub Pages serves at /<repo>/, so assets need the base path.
  // Vercel serves at the root, so we only set this for Pages builds.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
};

const withNextIntl = createNextIntlPlugin();

// Serwist wraps the config first (build-time SW compilation), then next-intl.
export default withNextIntl(withSerwist(nextConfig));
