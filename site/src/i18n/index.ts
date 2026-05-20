import en from "./locales/en.json";
import pt from "./locales/pt.json";
import { absoluteUrl, withBase } from "@/lib/paths";

export type Locale = "en" | "pt";
export type Messages = typeof en;

const catalogs: Record<Locale, Messages> = { en, pt };

export const locales: Locale[] = ["en", "pt"];
export const defaultLocale: Locale = "en";

export function getMessages(locale: string): Messages {
  return catalogs[locale as Locale] ?? catalogs[defaultLocale];
}

/** Relative path to a locale home (includes `base` in local/MAMP builds). */
export function localePath(locale: Locale, hash = ""): string {
  const path = hash ? `${locale}${hash}` : locale;
  return withBase(path);
}

/** Canonical / hreflang URLs (production or local, from `Astro.site`). */
export function alternateUrls(
  site: URL | string | undefined,
  path = ""
): { en: string; pt: string } {
  const suffix = path ? `/${path.replace(/^\//, "")}` : "";
  return {
    en: absoluteUrl(`en${suffix}`, site),
    pt: absoluteUrl(`pt${suffix}`, site),
  };
}
