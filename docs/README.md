# Documentation (Mintlify)

AI Parlance docs in **English** and **Portuguese**. Part of the [eudameron/aiparlance](https://github.com/eudameron/aiparlance) monorepo.

## Monorepo layout

```text
/
├── docs/          ← you are here (Mintlify)
├── site/          Marketing website
├── spec/          Normative grammar & v0.1 artifacts
├── examples/      Reference .aip files
├── packages/      Reference toolchain (parser, validator, CLI)
├── transpilers/   Emitters (matrix Preview packages)
└── scripts/       CI helpers (examples suite)
```

## This directory

```text
docs/
├── docs.json
├── logo.png          Full logo (dark theme)
├── logo-nav.png      Navbar (Mintlify + site)
├── favicon.png       Favicon
├── en/
└── pt/
```

Community onboarding: [en/getting-started.mdx](en/getting-started.mdx) · emitters: [en/first-transpiler.mdx](en/first-transpiler.mdx) · CRUD: [en/crud-walkthrough.mdx](en/crud-walkthrough.mdx).

Reference specs live in [`/examples`](../examples/), not under `docs/`.

## Local preview

```bash
cd docs
npx mintlify dev
```

## Public URL

**https://docs.aiparlance.org**

| Locale | Home |
|---|---|
| English | https://docs.aiparlance.org/en/introduction |
| Portuguese | https://docs.aiparlance.org/pt/introduction |
| Getting started | https://docs.aiparlance.org/en/getting-started |
| First emitters | https://docs.aiparlance.org/en/first-transpiler |
| CRUD walkthrough | https://docs.aiparlance.org/en/crud-walkthrough |

## Deploy

[Mintlify Cloud](https://mintlify.com) — docs root: **`/docs`**. Add custom domain `docs.aiparlance.org` in project settings (DNS CNAME → Mintlify).

Google Tag Manager: `integrations.gtm.tagId` in [`docs.json`](docs.json) (injected on all pages after deploy).

## Adding a page

1. Add `en/my-page.mdx` and `pt/my-page.mdx` (same slug).
2. Register paths in `docs.json` under each language (`en/my-page`, `pt/my-page`).
3. Keep **EN and PT in parity** — same sections, examples, and normative notes (not a shortened PT summary).
