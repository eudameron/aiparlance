# AI Parlance — Site

Institutional website for [aiparlance.org](https://aiparlance.org). Built with [Astro](https://astro.build) (static).

## Config files

| File | Purpose |
|------|---------|
| `astro.config.mjs` | **Local development** — optional subpath `base` when not served from domain root |
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

### Local development

Uses `astro.config.mjs`. Adjust `base` and `site` there if you serve the build from a subpath.

```bash
npm run dev
npm run build
npm run preview
```

Run `npm run build` after code changes when testing the static output.

### Production

Uses `astro.config-sample.mjs` (`base`: `/`).

```bash
npm run build:prod
npm run preview:prod
```

Upload `dist/` to the host root for `aiparlance.org`.

## Deploy

**Cloudflare:** passo a passo em [CLOUDFLARE.md](./CLOUDFLARE.md).

1. `npm run build:prod`
2. Publicar `dist/` (Cloudflare, Netlify, Vercel, Apache).
3. Apontar `aiparlance.org` para a raiz do build.

Ensure `/` → `/en` (`public/_redirects` + `src/pages/index.astro`), plus `sitemap.xml` and `robots.txt`.

## Brand assets

Brand assets in `public/` (`logo.png`, `logo-nav.png`, `favicon.png`). Sync copies to [`/docs`](../docs/) when updating.

## Playground

Client-side **preview** transpiler — not the official toolchain.
