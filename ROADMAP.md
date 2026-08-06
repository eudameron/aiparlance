# Roadmap — Phase C (Reference toolchain)

This roadmap tracked turning AI Parlance from **specification-only** into a **reference toolchain**, aligned with the public docs:

- Pipeline: `.aip` → Parser → AST → Validator → Transpilers ([Introduction](https://docs.aiparlance.org/en/introduction), [Specification](https://docs.aiparlance.org/en/specification))
- Normative grammar: [`spec/v0.1/grammar.ebnf`](spec/v0.1/grammar.ebnf)
- Stability tiers: Core / Infra (stable); Security / Behavior (beta) ([Specification § Stability](https://docs.aiparlance.org/en/specification#stability-levels))
- Transpiler matrix: PostgreSQL, OpenAPI, TypeScript **Preview**; others Planned ([Specification § Transpiler matrix](https://docs.aiparlance.org/en/specification#transpiler-matrix))
- PostgreSQL is the **primary** SQL target ([Database](https://docs.aiparlance.org/en/database))

**Status today:** Full v0.1 parse/validate (Core + Infra + Security + Behavior) and Preview emitters: `sql|openapi|typescript|go|mysql|workers|python|php|docs|tests`. The marketing playground remains **illustrative only**.

The overall language remains **draft** until this reference toolchain ships (per Specification).

---

## Goals

1. Ship a TypeScript toolchain that parses and validates `.aip` against the normative grammar and Specification MUST rules.
2. Emit useful artifacts from one IR: **PostgreSQL** (primary), **OpenAPI**, then **TypeScript** (first application backend).
3. Prove multi-target with shared AST — not by rewriting the playground demo.

## Non-goals (Phase C)

| Out of scope | Why |
|---|---|
| Implementing Proposed syntax (`permission` decl, `endpoint`) | Preview only until promoted in grammar |
| Roadmap language features (`has_many`, top-level `enum{}`, `custom`) | Explicitly not v0.1 |
| MySQL / Go / Python / PHP / Workers / Docs / Tests emitters | Matrix items deferred after the reference path |
| Replacing Mintlify or rewriting the marketing site | Separate from toolchain |
| Full Behavior runtime (Temporal-like) | Behavior is beta; parse/validate first, emit later |

---

## Implementation language

| Role | Choice | Rationale |
|---|---|---|
| Toolchain (parser, AST, validator, CLI) | **TypeScript** | Matches monorepo (`site/`), enables shared package with future playground |
| First SQL emitter | **PostgreSQL** | Documented primary target |
| First API contract emitter | **OpenAPI** | Paths/schemas/security from `entity` + `crud` (+ `api`/`auth`) |
| First application backend emitter | **TypeScript** | Interfaces + guards (matrix); same language as toolchain |
| Second application backend (later) | **Go** | structs, handlers, JWT middleware — after TS reference is stable |

---

## Package layout (target)

```text
packages/
  parser/          # lexer + parser → AST (grammar.ebnf)
  validator/       # semantic MUST rules (Specification § Validation)
  cli/             # aip parse | validate | emit
transpilers/
  sql/             # PostgreSQL DDL, indexes, seed → SQL
  openapi/         # OpenAPI 3.x
  typescript/      # interfaces, guards, minimal handlers
  go/              # (Phase C follow-up)
```

Exact npm package names may use an `@aiparlance/*` scope when scaffolding begins.

**Input to every transpiler:** validated AST (not raw `.aip` text).  
**Fixtures:** [`examples/minimal.aip`](examples/minimal.aip) → [`crm-reference.aip`](examples/crm-reference.aip) → [`ops-reference.aip`](examples/ops-reference.aip).

---

## Milestones

### M0 — Scaffold (prep)

- [x] Monorepo workspace for `packages/*` and `transpilers/*` (`@aiparlance/*`)
- [x] Test runner (Vitest) + CI (`.github/workflows/ci.yml`: typecheck + build + test)
- [x] CLI UX draft (`packages/cli` — `aip parse | validate | emit …`)

**Done when:** empty packages build in CI; no public claim that the toolchain ships yet. **M0 complete** — next is M1 (Core parser).

---

### M1 — Parser + AST (Core)

**Coverage (Core, stable):** `app`, `entity`, field types (`primitive`, inline `enum`, `belongs_to`), field modifiers, `crud`, `validation` block, line comments `//`, entity modifiers `timestamps` / `soft_delete`.

**Grammar source of truth:** [`spec/v0.1/grammar.ebnf`](spec/v0.1/grammar.ebnf).

**Accept:**

- [x] `aip parse examples/minimal.aip` succeeds and prints AST JSON
- [x] Rejects malformed Core with actionable errors (line/column)
- [x] Infra / Security / Behavior top-level blocks → `unsupported_tier` (`ParseError.code`)

**Out:** semantic validation beyond “tree is well-formed” (M2).

**Status:** **M1 complete** — next is M2 (semantic validator).

---

### M2 — Semantic validator

Implement Specification [§ Validation](https://docs.aiparlance.org/en/specification#validation) for Core (+ Infra pieces needed by emitters):

- [x] Missing `database` on `app` (parse always has one `app`)
- [x] References to missing `entity` (`crud`, `belongs_to`, `validation` target)
- [x] Unknown fields in `validation` blocks
- [x] Modifier order / duplicates (error vs warning per rule)
- [x] Implicit fields awareness (`id`, `created_at`, `updated_at`; `soft_delete` → `deleted_at`) — warnings on shadow

**Accept:**

- [x] `aip validate examples/minimal.aip` exits 0
- [x] Invalid fixtures exit non-zero with stable error codes/messages

Extend progressively: when Security/Behavior parse lands, add rules for `policy`+`auth`, `workflow` without `when`, missing `event`/`job`, unregistered builtins.

**Status:** **M2 complete** — next is M3 (PostgreSQL emitter).

---

### M3 — Transpiler: PostgreSQL (primary)

Per matrix: **DDL, migrations, indexes**. Per Database docs: naming (`User` → `users`, FK `user_id`), semantic types → PostgreSQL, implicit fields in `CREATE TABLE`.

**MVP artifacts from Core:**

- [x] `CREATE TABLE` for each `entity`
- [x] `belongs_to` → FK columns + `REFERENCES`
- [x] `unique` / `required` → constraints; `enum` → `CHECK` + `DEFAULT`
- [x] `soft_delete` / implicit `id` / timestamps in DDL
- [ ] `index` blocks → `CREATE INDEX` (needs Infra parse — deferred)
- [ ] `seed` → `INSERT` (needs Infra parse — deferred)

**Accept:**

- [x] `aip emit sql examples/minimal.aip` produces runnable PostgreSQL for the Core example
- [x] Golden-file tests against `transpilers/sql/fixtures/minimal.sql`

**Defer:** full migration versioning UX; MySQL dialect; `index` / `seed` until Infra-tier parse.

**Status:** **M3 complete** (Core DDL) — next is M4 (OpenAPI).

---

### M4 — Transpiler: OpenAPI

Per matrix: **paths, schemas, security**.

**MVP from `entity` + `crud` (+ `app.auth` when present):**

- [x] Schemas from entities (including implicit fields) + Create/Update variants
- [x] CRUD paths (`POST/GET/PUT/DELETE` per Syntax)
- [ ] `api.prefix` / `format` (needs Infra `api` parse — deferred; paths at `/`)
- [x] Security schemes from `app.auth` (`jwt`, `session`, `api_key`, `oauth`)

**Accept:**

- [x] Valid OpenAPI 3.0.3 JSON for `minimal.aip` (golden: `transpilers/openapi/fixtures/minimal.openapi.json`)

**Status:** **M4 complete** — next is M5 (TypeScript emitter).

---

### M5 — Transpiler: TypeScript (first backend)

Per matrix: **interfaces, guards**. Per Security multi-target notes: guards/decorators for TypeScript.

**MVP:**

- [x] TypeScript interfaces (or types) per `entity` (`Entity` / `EntityCreate` / `EntityUpdate`)
- [x] Runtime type guards from field modifiers / `validation` (zero deps; zod deferred)
- [x] Thin typed CRUD path helpers when `crud` is declared (framework-free)

**Accept:**

- [x] Emitted TS typechecks in isolation
- [x] Golden tests for `minimal.aip` (`transpilers/typescript/fixtures/minimal.ts`)

**Playground:** only after M5, optionally replace `site/src/lib/transpiler/` with the official packages — never the reverse.

**Status:** **M5 complete** — next is M6 (CLI + CI + docs status).

---
### M6 — CLI + CI + docs status

- [x] CLI: `parse` | `validate` | `emit <sql|openapi|typescript>`
- [x] CI: validate Core-supported examples (`minimal.aip`); assert richer references fail only with `unsupported_tier`; emit goldens for `minimal.aip` (`scripts/examples.test.ts`)
- [x] Introduction Note and Specification toolchain line reflect monorepo preview toolchain — **EN + PT**
- [x] Transpiler matrix: SQL, OpenAPI, TypeScript → **Preview** — **EN + PT**
- [x] Changelog + CONTRIBUTING for first toolchain / toolchain PRs

**Done when:** public docs no longer say “parser, validator, and transpilers are not published yet” without qualification; matrix reflects reality.

**Status:** **M6 complete** — Phase C Core reference path done. See [Follow-ups](#follow-ups-after-m6).

---

## Follow-ups (after M6)

| Order | Target | Notes |
|---|---|---|
| 1 | **Go** | ✅ Preview — `@aiparlance/go` · `aip emit go` |
| 2 | Expand Security + Behavior parse/validate | ✅ Infra + Security + Behavior parse/validate; CRM/ops examples validate |
| 3 | Workers | ✅ Preview — `@aiparlance/workers` · `aip emit workers` |
| 4 | MySQL | ✅ Preview — `@aiparlance/mysql` · `aip emit mysql` |
| 5 | Python, PHP | ✅ Preview — `aip emit python\|php` |
| 6 | Docs / Tests emitters | ✅ Preview — `aip emit docs\|tests` |

Further polish: deepen emitters (policy → guards, full MySQL migrations, playground wiring, npm publish).

Language features marked **roadmap** in the Specification stay documentation-only until a future language version.

---

## Tier rollout (parse / validate)

Emitters may start on Core-only AST. Expand parsing in this order (matches stability):

```text
Core (stable)     → M1–M5 foundation
Infra (stable)    → index, api, seed, timestamps, soft_delete (needed for M3/M4 depth)
Security (beta)   → auth, policy, predicates (OpenAPI security + TS guards)
Behavior (beta)   → workflow, event, lifecycle, job, queue, ai_context (Workers later)
```

Beta syntax may change between v0.x minors; keep emitters tolerant or version-gated.

---

## Success criteria (Phase C complete)

- [x] Reference parser + validator published (TypeScript packages in monorepo)
- [x] `examples/minimal.aip` validates and emits SQL + OpenAPI + TypeScript
- [x] PostgreSQL remains documented and implemented as primary SQL target
- [x] Transpiler matrix updated for shipped targets (EN + PT)
- [x] Playground either still labeled illustrative or wired to official packages
- [x] CONTRIBUTING updated: toolchain PRs welcome under package guidelines

---

## References

| Doc | Role |
|---|---|
| [Introduction](https://docs.aiparlance.org/en/introduction) | Pipeline + draft-language / toolchain note |
| [Getting started](https://docs.aiparlance.org/en/getting-started) | Install, CLI, emit matrix |
| [CRUD walkthrough](https://docs.aiparlance.org/en/crud-walkthrough) | Complete blog CRUD → emit |
| [Specification](https://docs.aiparlance.org/en/specification) | Grammar summary, validation MUST, matrix, stability |
| [Syntax](https://docs.aiparlance.org/en/syntax) | Core + Infra blocks |
| [Database](https://docs.aiparlance.org/en/database) | PostgreSQL primary, naming, seed |
| [Security](https://docs.aiparlance.org/en/security) | auth, policy, OpenAPI/TS artifacts |
| [Workflows](https://docs.aiparlance.org/en/workflows) | Behavior beta (post-MVP emit) |
| [`spec/v0.1/grammar.ebnf`](spec/v0.1/grammar.ebnf) | Normative EBNF |
| [`examples/`](examples/) | Conformance fixtures |
