# Documentation (Mintlify)

AI Parlance docs in **English** and **Portuguese**. Part of the [eudameron/aiparlance](https://github.com/eudameron/aiparlance) monorepo.

## Monorepo layout

```text
/
├── docs/          ← you are here (Mintlify)
├── site/          Institutional website
├── spec/          Normative grammar & v0.1 artifacts
├── examples/      Reference .aip files (e.g. crm-reference.aip)
└── transpilers/   Future code generators
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

## Deploy

[Mintlify Cloud](https://mintlify.com) — docs root: **`/docs`**. Add custom domain `docs.aiparlance.org` in project settings (DNS CNAME → Mintlify).

## Adding a page

1. Add `en/my-page.mdx` and `pt/my-page.mdx` (same slug).
2. Register paths in `docs.json` under each language (`en/my-page`, `pt/my-page`).
3. Keep **EN and PT in parity** — same sections, examples, and normative notes (not a shortened PT summary).
