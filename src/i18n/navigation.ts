import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale-aware <Link>, useRouter, usePathname, redirect, and permanentRedirect.
// Use these instead of next/navigation equivalents so the active locale is
// automatically prepended to paths.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
