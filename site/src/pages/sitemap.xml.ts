import type { APIRoute } from "astro";
import { locales, alternateUrls } from "@/i18n";

const paths = [
  "",
  "first-transpiler",
  "emitters",
  "emitters/postgresql",
  "emitters/openapi",
  "emitters/typescript",
];

export const GET: APIRoute = ({ site }) => {
  const entries = paths.flatMap((path) =>
    locales.map((lang) => {
      const alts = alternateUrls(site, path);
      return { loc: alts[lang], alts, path };
    })
  );

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries
  .map(
    ({ loc, alts, path }) => `  <url>
    <loc>${loc}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${alts.en}"/>
    <xhtml:link rel="alternate" hreflang="pt" href="${alts.pt}"/>
    <changefreq>weekly</changefreq>
    <priority>${path === "" ? "1.0" : path.startsWith("emitters") ? "0.9" : "0.8"}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
