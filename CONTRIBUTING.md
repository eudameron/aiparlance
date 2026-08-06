# Contributing

Thanks for interest in AI Parlance. v0.1 is **specification-only**: there is no published parser, validator, or transpiler yet. Most contributions improve the language definition, docs, and examples.

## Repository map

| Path | Role |
|---|---|
| [`docs/`](docs/) | Mintlify docs (EN + PT) — publish to docs.aiparlance.org |
| [`spec/v0.1/grammar.ebnf`](spec/v0.1/grammar.ebnf) | **Normative** machine-oriented grammar |
| [`examples/`](examples/) | Reference `.aip` specs |
| [`site/`](site/) | Marketing site (Astro) — separate npm project |
| [`packages/`](packages/) | Toolchain: `@aiparlance/parser`, `validator`, `cli` |
| [`transpilers/`](transpilers/) | Emitters: `sql`, `openapi`, `typescript` |

Root `npm` workspaces cover `packages/*` and `transpilers/*` only (not `site/`).

## Language / grammar changes

1. Update [`spec/v0.1/grammar.ebnf`](spec/v0.1/grammar.ebnf) first for any syntactic change.
2. Mirror the human summary and stability tables in **both**:
   - [`docs/en/specification.mdx`](docs/en/specification.mdx)
   - [`docs/pt/specification.mdx`](docs/pt/specification.mdx)
3. Update related domain pages (syntax, security, workflows, …) in **EN and PT** together.
4. Keep Proposed / roadmap constructs as grammar **comments** until they are promoted.

Do not invent syntax that only appears in the playground demo (`site/src/lib/transpiler/`) — that demo is not normative.

## Documentation (EN + PT)

- Every new or changed page needs **structural parity**: same sections and examples in `docs/en/` and `docs/pt/`.
- Register pages in [`docs/docs.json`](docs/docs.json) under both languages.
- Preview locally: `cd docs && npx mintlify dev`.

## Examples

- Prefer a dedicated `.aip` file for new constructs rather than overloading `crm-reference.aip`.
- List new files in [`examples/README.md`](examples/README.md).
- Specs must start with exactly one `app` block (see grammar).

## Site

- Production build: `cd site && npm run build:prod` (uses `astro.config-sample.mjs`).
- Do not use the local-only `npm run build` config for production deploys.

## Toolchain (Phase C)

See [`ROADMAP.md`](ROADMAP.md). From repo root:

```bash
npm ci
npm run typecheck
npm run build
npm test
```

Open an issue before large toolchain PRs so scope matches the current milestone (M0–M6).

Do not invent syntax that only appears in the playground demo (`site/src/lib/transpiler/`) — that demo is not normative.
## License

Contributions are under the [Apache License 2.0](LICENSE).
