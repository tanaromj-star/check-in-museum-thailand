import type { NextConfig } from "next";
import { withSerwist } from "@serwist/turbopack";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */
};

const withNextIntl = createNextIntlPlugin();

// Serwist wraps the config first (build-time SW compilation), then next-intl.
export default withNextIntl(withSerwist(nextConfig));
