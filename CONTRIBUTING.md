# Contributing

Thanks for interest in AI Parlance. v0.1 remains a **draft language**, but a **reference toolchain** ships in this monorepo: Core parser, validator, and emitters for PostgreSQL DDL, OpenAPI 3, and TypeScript (`aip parse` / `validate` / `emit`). Contributions may improve the language definition, docs, examples, or the toolchain.

## Repository map

| Path | Role |
|---|---|
| [`docs/`](docs/) | Mintlify docs (EN + PT) — publish to docs.aiparlance.org |
| [`spec/v0.1/grammar.ebnf`](spec/v0.1/grammar.ebnf) | **Normative** machine-oriented grammar |
| [`examples/`](examples/) | Reference `.aip` specs (validated in CI at the Core tier) |
| [`site/`](site/) | Marketing site (Astro) — separate npm project |
| [`packages/`](packages/) | Toolchain: `@aiparlance/parser`, `validator`, `cli` |
| [`transpilers/`](transpilers/) | Emitters: `sql`, `openapi`, `typescript` |
| [`scripts/`](scripts/) | Repo CI helpers (example validation + emit goldens) |

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
- CI runs `scripts/examples.test.ts`: Core-supported specs (today: `minimal.aip`) must **validate** and keep emit goldens in sync. Richer references (`crm-reference.aip`, `ops-reference.aip`) must exist and fail only with `unsupported_tier` until Infra/Security/Behavior parse ships.

## Site

- Production build: `cd site && npm run build:prod` (uses `astro.config-sample.mjs`).
- Do not use the local-only `npm run build` config for production deploys.

## Toolchain

See [`ROADMAP.md`](ROADMAP.md). Phase C milestones **M0–M6** are complete for the Core reference path.

From repo root:

```bash
npm ci
npm run typecheck
npm run build
npm test                 # unit tests + examples CI suite
npm run check:examples   # examples suite only
```

```bash
node packages/cli/dist/cli.js parse examples/minimal.aip
node packages/cli/dist/cli.js validate examples/minimal.aip
node packages/cli/dist/cli.js emit sql examples/minimal.aip
node packages/cli/dist/cli.js emit openapi examples/minimal.aip
node packages/cli/dist/cli.js emit typescript examples/minimal.aip
```

### Toolchain PR guidelines

- Open an issue before large toolchain PRs so scope matches the current roadmap (post–M6: Go, Infra parse, Security/Behavior, …).
- Prefer small packages: parser/validator changes need tests; emitters need golden fixtures under `transpilers/*/fixtures/`.
- Keep emitters aligned on naming (`@aiparlance/sql` helpers) and Core AST only unless the milestone expands parse tiers.
- Do not wire the marketing playground to official packages unless that is the agreed milestone; the playground stays illustrative until then.

## License

Contributions are under the [Apache License 2.0](LICENSE).
