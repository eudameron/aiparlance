# AI Parlance — Site

Institutional website for [aiparlance.org](https://aiparlance.org). Built with [Astro](https://astro.build) (static).

## Config files

| File | Purpose |
|------|---------|
| `astro.config.mjs` | **Local** — MAMP subpath, `site` = `http://localhost:8888` |
| `astro.config-sample.mjs` | **Production** — domain root, `site` = `https://aiparlance.org` |

Copy the sample when deploying: `cp astro.config-sample.mjs astro.config.mjs` is optional; prefer `npm run build:prod` so local config stays untouched.

## Locales

| URL (production) | Language |
|------------------|----------|
| `/en` | English |
| `/pt` | Portuguese |

**Update copy:** edit `src/i18n/locales/en.json` and `src/i18n/locales/pt.json` (keep keys in sync).

## Structure

```text
site/
├── astro.config.mjs           Local (default)
├── astro.config-sample.mjs    Production template
├── public/
├── src/
│   ├── i18n/locales/
│   ├── lib/transpiler/
│   ├── components/
│   ├── layouts/
│   └── pages/
└── dist/                      Build output
```

## Commands

```bash
cd site
npm install
```

### Local (MAMP + dev server)

Uses `astro.config.mjs` (`base`: `/dev/aiparlance.org/v1/site/dist/`).

```bash
npm run dev       # http://localhost:4321/dev/aiparlance.org/v1/site/dist/en/
npm run build     # then open MAMP URLs below
npm run preview   # preview local build with correct base
```

**MAMP** (Apache on port 8888, document root = `htdocs`):

- English: http://localhost:8888/dev/aiparlance.org/v1/site/dist/en/
- Portuguese: http://localhost:8888/dev/aiparlance.org/v1/site/dist/pt/
- Redirect: http://localhost:8888/dev/aiparlance.org/v1/site/dist/

Run `npm run build` after code changes.

### Production

Uses `astro.config-sample.mjs` (`base`: `/`).

```bash
npm run build:prod
npm run preview:prod   # http://localhost:4321/en/
```

Upload `dist/` to the host root for `aiparlance.org`.

## Deploy

1. `npm run build:prod`
2. Upload `dist/` to static hosting (Netlify, Vercel, Cloudflare Pages, Apache).
3. Point `aiparlance.org` to the build root.

Ensure `/` → `/en` (see `src/pages/index.astro`), plus `sitemap.xml` and `robots.txt` at the site root.

## Brand assets

Brand assets in `public/` (`logo.png`, `logo-nav.png`, `favicon.png`). Sync copies to [`/docs`](../docs/) when updating.

## Playground

Client-side **preview** transpiler — not the official toolchain.
