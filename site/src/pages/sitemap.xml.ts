import type { APIRoute } from "astro";
import { locales, alternateUrls } from "@/i18n";

export const GET: APIRoute = ({ site }) => {
  const urls = locales.map((lang) => alternateUrls(site)[lang]);
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls
  .map(
    (loc) => `  <url>
    <loc>${loc}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${alternateUrls(site).en}"/>
    <xhtml:link rel="alternate" hreflang="pt" href="${alternateUrls(site).pt}"/>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
