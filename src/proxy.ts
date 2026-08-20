import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for API routes, Next.js internals, and
  // static assets (including the service worker and manifest).
  matcher: ["/((?!api|_next|_vercel|sw.js|manifest.webmanifest|.*\\..*).*)"],
};
