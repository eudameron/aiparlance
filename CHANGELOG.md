# Changelog

All notable changes to this repository are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project uses a draft **v0.1** language version. A **reference toolchain** (preview) ships in-monorepo.

## [Unreleased]

### Added

- Phase C **M6**: CI covers Core-supported examples + SQL / OpenAPI / TypeScript goldens (`scripts/examples.test.ts`); CONTRIBUTING updated for toolchain PRs
- Docs: [Getting started](https://docs.aiparlance.org/en/getting-started) (install, CLI, emit, tests) and [First emitters](https://docs.aiparlance.org/en/first-transpiler) (EN + PT)
- Site: toolchain section, `/en|pt/first-transpiler` page, copy aligned with Preview emitters

### Changed

- Docs, site copy, and CONTRIBUTING treat Core **parser / validator / SQL / OpenAPI / TypeScript** emitters as available in the monorepo (`aip parse` / `validate` / `emit`), not specification-only
- Transpiler matrix: PostgreSQL, OpenAPI, and TypeScript marked **Preview** (EN + PT)

## [0.1.0] — 2026-08-06

### Added

- Normative prose documentation (EN + PT) via Mintlify — [docs.aiparlance.org](https://docs.aiparlance.org)
- Marketing site (Astro) — [aiparlance.org](https://aiparlance.org)
- Machine-oriented grammar at [`spec/v0.1/grammar.ebnf`](spec/v0.1/grammar.ebnf) with all Core / Infra / Security (beta) / Behavior (beta) nonterminals defined
- Reference examples: `minimal.aip`, `crm-reference.aip`, `ops-reference.aip`
- [`CONTRIBUTING.md`](CONTRIBUTING.md)
- Phase C reference toolchain (M0–M5):
  - **M0** scaffold: npm workspaces, Vitest, GitHub Actions CI, CLI UX
  - **M1** Core lexer/parser (`@aiparlance/parser`) and `aip parse`
  - **M2** semantic validator (`@aiparlance/validator`) and `aip validate`
  - **M3** PostgreSQL DDL (`@aiparlance/sql`) and `aip emit sql`
  - **M4** OpenAPI 3 (`@aiparlance/openapi`) and `aip emit openapi`
  - **M5** TypeScript interfaces/guards (`@aiparlance/typescript`) and `aip emit typescript`

### Clarified

- Spec remains **draft**; language is not frozen for v1.0
- Stability tables list `validation` (Core) and `ai_context` (Behavior)
- Docs EBNF summary requires `app` first (`program = app_block , { block }`)
- Proposed features (`permission` decl, `endpoint`) stay comments-only in the grammar

### Known gaps

- Infra / Security / Behavior blocks are not fully parsed yet (Core-tier validate with warnings on richer examples)
- Remaining matrix targets (Go, MySQL, Python, PHP, Workers, …) are **Planned**
- Playground on the marketing site is illustrative only

See [`ROADMAP.md`](ROADMAP.md) for follow-ups after Phase C.
