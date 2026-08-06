# Contributing

Thanks for interest in AI Parlance. v0.1 remains a **draft language**. A **reference toolchain** ships in this monorepo: full v0.1 parser/validator and Preview emitters across the matrix (`aip parse` / `validate` / `emit …`).

## Repository map

| Path | Role |
|---|---|
| [`docs/`](docs/) | Mintlify docs (EN + PT) — docs.aiparlance.org |
| [`spec/v0.1/grammar.ebnf`](spec/v0.1/grammar.ebnf) | **Normative** machine-oriented grammar |
| [`examples/`](examples/) | Reference `.aip` specs (all validated in CI) |
| [`site/`](site/) | Marketing site (Astro) — separate npm project |
| [`packages/`](packages/) | Toolchain: `@aiparlance/parser`, `validator`, `cli` |
| [`transpilers/`](transpilers/) | Emitters: `sql`, `openapi`, `typescript`, `go`, `mysql`, `workers`, `python`, `php`, `docs`, `tests` |
| [`scripts/`](scripts/) | Repo CI helpers (example validation + emit asserts) |
| [`ROADMAP.md`](ROADMAP.md) | Phase C (done) · Phase D (active) |

Root `npm` workspaces cover `packages/*` and `transpilers/*` only (not `site/`).

## Keep docs and roadmap in sync

**Rule:** after every implementation, update documentation and the roadmap in the same change (or immediately after).

Checklist:

1. [`ROADMAP.md`](ROADMAP.md) — status, milestone checkboxes, priorities
2. Mintlify **EN + PT** pages that describe the old behavior
3. [`CHANGELOG.md`](CHANGELOG.md) — `[Unreleased]`
4. [`examples/README.md`](examples/README.md) and docs Examples menu when adding specs
5. Site i18n if emit targets or playground claims change

Do not leave stale “Planned”, `unsupported_tier`, or “Core only” claims when the toolchain already supports more.

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
- Examples live under the **Examples** / **Exemplos** nav group.
- Preview locally: `cd docs && npx mintlify dev`.

## Examples

- Prefer a dedicated `.aip` file for new constructs rather than overloading a single reference.
- List new files in [`examples/README.md`](examples/README.md) and add Mintlify pages under `docs/*/examples/`.
- Specs must start with exactly one `app` block (see grammar).
- CI (`scripts/examples.test.ts`) **validates every** `examples/*.aip` (Core + Infra + Security + Behavior). Goldens for `minimal.aip` emit (SQL / OpenAPI / TS / Go) must stay in sync; richer fixtures assert indexes/seeds/OpenAPI prefixes as covered by tests.

## Site

- Production build: `cd site && npm run build:prod` (uses `astro.config-sample.mjs`).
- Do not use the local-only `npm run build` config for production deploys.
- Playground remains **illustrative** until Phase D wires official packages.

## Toolchain

See [`ROADMAP.md`](ROADMAP.md). **Phase C complete.** Active work: **Phase D** (deepen TypeScript / OpenAPI / SQL, then playground + npm).

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
node packages/cli/dist/cli.js validate examples/blog-crud.aip
node packages/cli/dist/cli.js emit sql examples/blog-crud.aip
node packages/cli/dist/cli.js emit openapi examples/blog-crud.aip
node packages/cli/dist/cli.js emit typescript examples/blog-crud.aip
node packages/cli/dist/cli.js emit go examples/minimal.aip
node packages/cli/dist/cli.js emit mysql examples/mysql-minimal.aip
```

Emit targets: `sql | openapi | typescript | go | mysql | workers | python | php | docs | tests`.

### Toolchain PR guidelines

- Open an issue before large toolchain PRs so scope matches **Phase D** priorities (depth before new shallow emitters).
- Prefer small packages: parser/validator changes need tests; emitters need fixtures under `transpilers/*/fixtures/` when goldens apply.
- Keep emitters aligned on naming (`@aiparlance/*` helpers) and on the shared validated AST.
- Do not wire the marketing playground to official packages unless that is the agreed Phase D milestone.

## License

Contributions are under the [Apache License 2.0](LICENSE).
