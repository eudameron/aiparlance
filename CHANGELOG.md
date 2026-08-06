# Changelog

All notable changes to this repository are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project uses a draft **v0.1** language version until a reference toolchain ships.

## [Unreleased]

### Added

- Phase C **M3**: PostgreSQL DDL emitter (`@aiparlance/sql`) and `aip emit sql`
- Phase C **M2**: semantic validator (`@aiparlance/validator`) and `aip validate <file.aip>`
- Phase C **M1**: Core lexer/parser (`@aiparlance/parser`) and `aip parse <file.aip>`
- Phase C **M0** scaffold: npm workspaces (`packages/*`, `transpilers/*`), Vitest, GitHub Actions CI, CLI UX stub (`aip`)

## [0.1.0] — 2026-08-06

### Added

- Normative prose documentation (EN + PT) via Mintlify — [docs.aiparlance.org](https://docs.aiparlance.org)
- Marketing site (Astro) — [aiparlance.org](https://aiparlance.org)
- Machine-oriented grammar at [`spec/v0.1/grammar.ebnf`](spec/v0.1/grammar.ebnf) with all Core / Infra / Security (beta) / Behavior (beta) nonterminals defined
- Reference examples: `minimal.aip`, `crm-reference.aip`, `ops-reference.aip`
- [`CONTRIBUTING.md`](CONTRIBUTING.md)

### Clarified

- Spec remains **draft** and **specification-only**: parser, validator, and transpilers are not published yet
- Stability tables list `validation` (Core) and `ai_context` (Behavior)
- Docs EBNF summary requires `app` first (`program = app_block , { block }`)
- Proposed features (`permission` decl, `endpoint`) stay comments-only in the grammar

### Known gaps

- No official parser / AST / semantic validator
- Transpiler matrix targets are all **Planned**
- Playground on the marketing site is illustrative only

See [`ROADMAP.md`](ROADMAP.md) for Phase C (reference toolchain).
