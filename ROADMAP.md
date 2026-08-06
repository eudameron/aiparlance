# Roadmap

AI Parlance turns **draft language + docs** into a **reference toolchain** and, next, into **usable depth** (emitters that close a real CRUD path) and **distribution**.

| Doc | Role |
|---|---|
| [Introduction](https://docs.aiparlance.org/en/introduction) | Pipeline |
| [Specification](https://docs.aiparlance.org/en/specification) | Grammar summary, MUST rules, matrix, stability |
| [`spec/v0.1/grammar.ebnf`](spec/v0.1/grammar.ebnf) | Normative EBNF |
| [Examples](https://docs.aiparlance.org/en/examples) | All reference `.aip` specs |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | How to contribute |

---

## Status today (2026-08)

| Area | State |
|---|---|
| Language | **Draft** v0.1 |
| Parse / validate | **Full v0.1** — Core + Infra + Security + Behavior |
| Emitters (Preview) | `sql` · `openapi` · `typescript` · `go` · `mysql` · `workers` · `python` · `php` · `docs` · `tests` |
| Examples (CI) | `minimal`, `blog-crud`, `inventory-crud`, `mysql-minimal`, `crm-reference`, `ops-reference` |
| Docs / site | Aligned with 10-emitter matrix + Examples menu (EN + PT) |
| npm registry | **Not published** — clone monorepo, `npm ci && npm run build` |
| Marketing playground | **Illustrative only** (not official packages) |

**Phase C (reference toolchain) is complete.** Matrix follow-ups after M6 are complete. Active work is **Phase D**.

---

## Phase C — Reference toolchain (complete)

Goal: ship parse → validate → emit for a Core reference path, then expand the matrix.

### Goals (met)

1. TypeScript toolchain parses and validates `.aip` against grammar + MUST rules.
2. Emit useful artifacts: **PostgreSQL** (primary), **OpenAPI**, **TypeScript**, then the full Preview matrix.
3. Shared AST — not by rewriting the playground demo.

### Non-goals (still out of scope for Phase C / early Phase D)

| Out of scope | Why |
|---|---|
| Proposed syntax (`permission` decl, `endpoint`) | Preview in grammar comments until promoted |
| Roadmap language features (`has_many`, top-level `enum{}`, `custom`) | Not v0.1 |
| Full Behavior runtime (Temporal-like) | Parse/validate + stubs first |
| Replacing Mintlify / full site redesign | Separate from toolchain |

### Package layout

```text
packages/
  parser/          # lexer + parser → AST
  validator/       # semantic MUST rules
  cli/             # aip parse | validate | emit
transpilers/
  sql/ openapi/ typescript/ go/
  mysql/ workers/ python/ php/ docs/ tests/
```

**Input to every transpiler:** validated AST (not raw `.aip` text).

### Milestones M0–M6

| Milestone | Deliverable | Status |
|---|---|---|
| **M0** | Workspaces, Vitest, CI, CLI UX | ✅ |
| **M1** | Core parser + AST | ✅ |
| **M2** | Semantic validator (Core+) | ✅ |
| **M3** | PostgreSQL DDL (`aip emit sql`) | ✅ — indexes + seeds added in follow-up |
| **M4** | OpenAPI 3 (`aip emit openapi`) | ✅ — `api.prefix` added in follow-up |
| **M5** | TypeScript interfaces/guards | ✅ |
| **M6** | CLI + examples CI + docs status | ✅ |

### Follow-ups after M6 (complete)

| Order | Target | Status |
|---|---|---|
| 1 | Go emitter | ✅ Preview |
| 2 | Infra + Security + Behavior parse/validate | ✅ |
| 3 | Workers | ✅ Preview |
| 4 | MySQL | ✅ Preview |
| 5 | Python, PHP | ✅ Preview |
| 6 | Docs / Tests emitters | ✅ Preview |
| — | Robust examples + Examples docs menu | ✅ |

Historical detail for M0–M6 accept criteria remains in git history; this file tracks **current** status and **Phase D** forward.

---

## Phase D — Depth & distribution (active)

Close the gap between “Preview stubs” and a **usable happy path**, then distribute packages.

### Goals

1. **Deepen** TypeScript, OpenAPI, and PostgreSQL until a blog CRUD demo can migrate + serve + match OpenAPI with minimal glue.
2. Reflect **policies** in OpenAPI security and TS guards.
3. Optionally wire the **playground** to official packages.
4. **Publish** `@aiparlance/*` to npm when depth is honest enough for early adopters.

### Non-goals (Phase D)

| Out of scope | Why |
|---|---|
| Ten more shallow emitters | Prefer depth over matrix width |
| UI / mobile emitters | Outside IR scope |
| Language v0.2 features | Separate language milestone |
| Production Behavior orchestrator | Stubs + one concrete worker adapter max |

### Priority order (deepen first)

| Priority | Emitter | Target depth |
|---|---|---|
| **P0** | **TypeScript** | Zod (or richer guards), thin runnable CRUD (e.g. Hono), policy checks |
| **P0** | **OpenAPI** | Policy → security/scopes; richer examples from seeds |
| **P0** | **SQL (PostgreSQL)** | Versioned migrations story; keep indexes/seeds solid |
| P1 | Go | Mirror TS happy-path depth as second backend |
| P1 | Workers | One concrete adapter (e.g. BullMQ-shaped stubs) |
| P1 | MySQL | Parity with Postgres migration story |
| P2 | python / php / docs / tests | Polish only; no new scope |

### New emitters worth considering (after P0)

Only if they close ecosystem loops — not for coverage:

1. Prisma or Drizzle schema  
2. Zod as dedicated emit (if not folded into TypeScript)  
3. TS HTTP client / SDK  
4. One runnable scaffold (Hono or FastAPI) — may live inside `typescript` deepen

### Milestones (Phase D)

#### D1 — Truth sync & docs hygiene

- [x] Docs/site match 10-emitter reality (EN + PT)
- [x] Examples menu + CRUD walkthrough + robust `.aip` fixtures
- [x] This roadmap rewritten for post–Phase C reality
- [x] CONTRIBUTING + CHANGELOG always reflect current CI/examples rules
- [x] Cursor / contributor rule: update docs + roadmap after implementations

#### D2 — Deepen TypeScript + OpenAPI + SQL

- [ ] TS: stronger validation story (Zod or equivalent); policy-aware guards
- [ ] TS: minimal runnable CRUD handlers (framework chosen and documented)
- [ ] OpenAPI: per-operation security from `policy` + `auth`
- [ ] SQL: documented migration workflow (beyond single DDL dump)
- [ ] Golden / integration tests for `examples/blog-crud.aip` across the three

**Done when:** README can show “validate blog-crud → migrate → run API → OpenAPI matches” with ≤ one thin glue file.

#### D3 — Playground + npm

- [ ] Marketing playground calls official `@aiparlance/*` (or clearly documents remaining limits)
- [ ] Publish packages to npm (`parser`, `validator`, `cli`, priority emitters)
- [ ] Getting started uses `npx` / global CLI without cloning (or documents both paths)

#### D4 — Secondary depth (optional)

- [ ] Go parity with TS happy path (thin)
- [ ] Workers: one queue adapter
- [ ] MySQL migration parity

---

## Tier rollout (parse / validate)

```text
Core (stable)     → ✅ M1–M5 foundation
Infra (stable)    → ✅ index, api, seed, timestamps, soft_delete
Security (beta)   → ✅ auth, policy, predicates (emitter enrichment = Phase D)
Behavior (beta)   → ✅ workflow, event, lifecycle, job, queue, ai_context
```

Beta syntax may still change between v0.x minors; keep emitters tolerant or version-gated.

---

## Success criteria

### Phase C (met)

- [x] Reference parser + validator in monorepo
- [x] `minimal.aip` validates and emits SQL + OpenAPI + TypeScript
- [x] PostgreSQL primary SQL target
- [x] Matrix updated for shipped Preview targets (EN + PT)
- [x] Playground labeled illustrative **or** wired to official packages
- [x] CONTRIBUTING welcomes toolchain PRs

### Phase D (in progress)

- [ ] One documented end-to-end happy path (blog CRUD)
- [ ] Policy reflected in OpenAPI + TS
- [ ] npm publish of core packages
- [ ] Docs/roadmap stay in sync after every implementation (process)

---

## Documentation & roadmap policy

**After every implementation** (feature, emitter depth, parse/validate change, or public example):

1. Update **this file** if status, milestones, or priorities changed.
2. Update **EN + PT** Mintlify pages that mention the old behavior.
3. Update [`CHANGELOG.md`](CHANGELOG.md) under `[Unreleased]`.
4. Update [`CONTRIBUTING.md`](CONTRIBUTING.md) / [`examples/README.md`](examples/README.md) when CI or contributor flows change.
5. Keep site i18n (`site/src/i18n/locales/*.json`) honest about emit targets and playground limits.

Do not leave “Planned” / `unsupported_tier` / “Core only” claims in docs when the toolchain already supports more.

---

## References

| Doc | Role |
|---|---|
| [Getting started](https://docs.aiparlance.org/en/getting-started) | Install, CLI, emit matrix |
| [First emitters](https://docs.aiparlance.org/en/first-transpiler) | Emitter story |
| [CRUD walkthrough](https://docs.aiparlance.org/en/crud-walkthrough) | Blog CRUD → emit |
| [Examples](https://docs.aiparlance.org/en/examples) | Reference specs |
| [Database](https://docs.aiparlance.org/en/database) | PostgreSQL primary, MySQL Preview |
| [Security](https://docs.aiparlance.org/en/security) | auth, policy |
| [Workflows](https://docs.aiparlance.org/en/workflows) | Behavior beta |
| [`examples/`](examples/) | Conformance fixtures |
