# Changelog

All notable changes to this repository are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project uses a draft **v0.1** language version. A **reference toolchain** (preview) ships in-monorepo.

## [Unreleased]

### Added

- Docs **Emitters** menu (EN+PT): overview + per-emitter pages with role, score, objectives, and tests
- Marketing site: emitters hub + featured pages (PostgreSQL, OpenAPI, TypeScript) EN+PT — benefits/SEO; maturity stays in docs
- PT Emitters docs: objective Pass/Partial/Fail lists translated to Portuguese (sidebar titles polished)
- [`EMITTER_OBJECTIVES.md`](EMITTER_OBJECTIVES.md) **v2** — role-aware checklist (55 IDs), N/A scoring, combined happy path HP1–HP10; per-emitter scorecards rescored
- Docs **Examples** / **Exemplos** menu with pages for every reference `.aip` (EN + PT)
- Robust examples: `blog-crud.aip`, `inventory-crud.aip`, `mysql-minimal.aip`
- CRUD walkthrough docs (EN + PT)
- **Infra / Security / Behavior parse + validate** — `index`, `api`, `seed`, `policy`, `workflow`, `event`, `lifecycle`, `job`, `queue`, `ai_context`
- SQL: `CREATE INDEX` + `INSERT` seeds; OpenAPI: `api.prefix` on paths
- Matrix emitters (Preview): `mysql`, `workers`, `python`, `php`, `docs`, `tests`
- **Go emitter** (`@aiparlance/go`) and `aip emit go`
- Phase C **M6**: CI covers examples + goldens; CONTRIBUTING for toolchain PRs
- Getting started + First emitters docs; site toolchain pages for the full matrix

### Changed

- [`ROADMAP.md`](ROADMAP.md): Phase C marked complete; **Phase D** (depth & distribution) is active
- CONTRIBUTING: full-tier examples CI; docs/roadmap sync policy; Phase D PR guidance
- Docs/site treat all ten Preview emitters and full-tier validate as current reality
- Transpiler matrix: all listed targets **Preview** (EN + PT); MySQL no longer Planned
- PT docs (`docs/pt/`): natural Brazilian Portuguese copy — fewer English calques in emitter objectives and narrative pages
- Site PT (`pt.json`): more natural Brazilian Portuguese marketing copy
- Home toolchain cards: badge shows maturity score % (e.g. PostgreSQL 65%, MySQL 61%)
- Site nav Emitters → `/emitters`; hub badge removed; CTAs/docs use **Comece aqui** / **Get started here**; drop “dialeto/dialect” wording in docs and site

### Policy

- After every implementation, update roadmap + documentation (EN/PT) + changelog (see ROADMAP § Documentation & roadmap policy)

## [0.1.0] — 2026-08-06

### Added

- Normative prose documentation (EN + PT) via Mintlify — [docs.aiparlance.org](https://docs.aiparlance.org)
- Marketing site (Astro) — [aiparlance.org](https://aiparlance.org)
- Machine-oriented grammar at [`spec/v0.1/grammar.ebnf`](spec/v0.1/grammar.ebnf)
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

### Known gaps (at 0.1.0 release; largely addressed in Unreleased)

- At tag time, Infra / Security / Behavior parse and remaining matrix emitters were still in progress
- Playground on the marketing site remains illustrative until Phase D

See [`ROADMAP.md`](ROADMAP.md) for Phase D.
