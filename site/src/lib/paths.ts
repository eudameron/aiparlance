/** Prefix public asset paths with Astro `base` (e.g. MAMP subfolder). */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL;
  const baseSlash = base.endsWith("/") ? base : `${base}/`;
  const clean = path.startsWith("/") ? path.slice(1) : path;
  return `${baseSlash}${clean}`;
}

/** Absolute URL for SEO / Open Graph (respects `site` + `base`). */
export function absoluteUrl(path: string, site: URL | string | undefined): string {
  const origin = site?.toString() ?? "https://aiparlance.org";
  return new URL(withBase(path), origin).href;
}
