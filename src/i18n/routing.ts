import { defineRouting } from "next-intl/routing";

/**
 * The two supported locales. Thai is the default (the app targets museums
 * in Thailand); English is available for tourists.
 */
export const routing = defineRouting({
  locales: ["th", "en"],
  defaultLocale: "th",
});

export type Locale = (typeof routing.locales)[number];
