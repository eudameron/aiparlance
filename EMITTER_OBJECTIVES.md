# Emitter Objectives

Canonical checklist for what it takes to build a **real data-oriented system** from an AI Parlance (`.aip`) spec.

This is **v2** of the checklist: role-aware scoring, Spec vs Stretch items, and coverage of gaps that show up in real development (pagination, errors, config, soft-delete semantics, Behavior detail, `ai_context`, consumers).

---

## Scoring rules

| Mark | Meaning | Counts as Pass? |
|---|---|---|
| ✅ Pass | Emitted and usable (not throw / 501-only stub) | Yes |
| ⚠️ Partial | Present but incomplete | No |
| ❌ Fail | Applicable but missing | No |
| ➖ N/A | Outside this emitter’s **role** | Excluded from denominator |

**Score** = `✅ / (total − ➖)`  

⚠️ and ❌ do **not** increase the numerator.  
Do not mark hard work as N/A to inflate scores — N/A only follows the [role matrix](#emitter-roles).

**Scope** on each item:

| Tag | Meaning |
|---|---|
| `spec` | Backed by v0.1 grammar / docs today |
| `stretch` | Needed for real systems; may outpace the language or current emitters |

Re-score after every emitter change. If items are added/removed, renumber and refresh **all** scorecards + this scoreboard in the same change.

---

## Emitter roles

| Role | Packages | Expected strength |
|---|---|---|
| `schema` | `sql`, `mysql` | Persistence + domain columns |
| `contract` | `openapi` | HTTP contract + auth/policy metadata |
| `app` | `typescript`, `go`, `python`, `php` | Types → runnable API |
| `workers` | `workers` | Jobs / queues / workflow wiring |
| `docs` | `docs` | Human-readable reference |
| `tests` | `tests` | Automated fixtures / scaffolds |

### Role → applicable sections

| Section | schema | contract | app | workers | docs | tests |
|---|---|---|---|---|---|---|
| A Domain | ✅* | ✅ | ✅ | ➖ | ✅† | ➖ |
| B Validation | ✅ | ✅ | ✅ | ➖ | ✅† | ➖ |
| C Persistence | ✅ | ➖ | ◐‡ | ➖ | ➖ | ➖ |
| D HTTP | ➖ | ✅ | ✅ | ➖ | ✅† | ✅† |
| E Auth/policy | ➖ | ✅ | ✅ | ➖ | ✅† | ✅† |
| F Runtime | ➖ | ➖ | ✅ | ✅§ | ➖ | ➖ |
| G Behavior | ➖ | ➖ | ◐ | ✅ | ✅† | ➖ |
| H Quality | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| I Consumers | ➖ | ✅ | ✅ | ➖ | ➖ | ➖ |
| J Ops | ➖ | ➖ | ✅ | ✅ | ➖ | ➖ |

\* `schema`: A2/A3 are ➖ (create/update shapes are app/contract concerns).  
† `docs` / `tests`: “emit” means **document** or **fixture** the capability, not implement runtime.  
‡ `app`: C1 Pass if ORM/query schema is emitted; otherwise ❌ until then (not ➖ — apps should own data access eventually).  
§ `workers`: F applies to worker entrypoints / job runners, not HTTP servers.

---

## Combined happy path (Phase D Done)

Not scored per package. **Done** when **all** are true using `typescript` + `openapi` + `sql` together on `examples/blog-crud.aip`:

| # | Criterion |
|---|---|
| HP1 | `aip validate` green |
| HP2 | SQL applies (migrate or documented dump) including indexes + seed |
| HP3 | OpenAPI paths under `api.prefix` match the running API |
| HP4 | TS (or thin glue ≤ 1 file) serves CRUD without 501 stubs |
| HP5 | Request validation rejects invalid creates/updates |
| HP6 | Auth scheme from `app.auth` is enforced on protected routes |
| HP7 | At least one `policy` rule enforced (e.g. `role(admin)` delete) |
| HP8 | Soft-deleted rows hidden on list/get (or documented opt-in) |
| HP9 | OpenAPI + SQL + TS naming stay aligned (H5) |
| HP10 | CI proves HP1–HP4 (minimum) on `blog-crud` |

---

## Checklist

### A — Domain model

| ID | Scope | Objective |
|---|---|---|
| A1 | spec | Emit entity shapes (types / structs / schemas / tables) from `entity` |
| A2 | spec | Emit create-input shapes (`EntityCreate` or equivalent) |
| A3 | spec | Emit update-input shapes (`EntityUpdate` or equivalent) |
| A4 | spec | Emit enums / constrained variants from `enum(…)` |
| A5 | spec | Emit `belongs_to` as FKs or refs |
| A6 | spec | Emit implicit `id` primary key |
| A7 | spec | Emit `timestamps` (`created_at` / `updated_at`) |
| A8 | spec | Emit `soft_delete` field/column (`deleted_at`) |
| A9 | stretch | Soft-delete **semantics** (default reads filter deleted rows) |

### B — Validation

| ID | Scope | Objective |
|---|---|---|
| B1 | spec | Honor `required` / `optional` |
| B2 | spec | Honor `unique` |
| B3 | spec | Apply `validation { }` beyond required folding |
| B4 | spec | Map semantic types (`email`, `phone`, …) distinctly |

### C — Persistence

| ID | Scope | Objective |
|---|---|---|
| C1 | spec | Durable schema (DDL or ORM / query models) |
| C2 | spec | Indexes from `index { }` |
| C3 | spec | Seeds from `seed { }` |
| C4 | stretch | Versioned migrations (ordered **up**) |
| C5 | stretch | Migration **down** / rollback |
| C6 | spec | Respect `app.database` target |
| C7 | stretch | Transactions for multi-statement / workflow writes |

### D — HTTP / API surface

| ID | Scope | Objective |
|---|---|---|
| D1 | spec | Full CRUD surface for `crud` entities (list/create/get/update/delete) |
| D2 | spec | Honor `api.prefix` |
| D3 | spec | Honor `api.cors` (config or middleware) |
| D4 | spec | Honor `api.rate_limit` (config or enforcement) |
| D5 | stretch | Pagination and/or filter/sort on list |
| D6 | stretch | Typed error responses (4xx/5xx + stable body shape) |
| D7 | spec | Honor `api.format` (e.g. JSON) |

### E — Auth & policy

| ID | Scope | Objective |
|---|---|---|
| E1 | spec | Auth scheme from `app.auth` (`jwt` / `api_key` / `session` / `oauth`) |
| E2 | spec | Wire auth into API (security requirements or middleware) |
| E3 | spec | Reflect `policy` create/read/update/delete |
| E4 | spec | Predicates: `public`, `authenticated`, `role(…)` |
| E5 | spec | Predicates: `owner` / `owner_or_manager(…)` |
| E6 | stretch | Consistent **401/403** denial paths (runtime **or** contract documents both) |

### F — Runnable runtime

| ID | Scope | Objective |
|---|---|---|
| F1 | stretch | Runnable server or worker entrypoint |
| F2 | stretch | Handlers/jobs perform real work (not only 501 / `throw`) |
| F3 | stretch | DB read/write (or generated query / ORM layer) |
| F4 | stretch | Runtime request validation aligned with B\* |
| F5 | stretch | Runtime policy checks aligned with E\* |

### G — Behavior

| ID | Scope | Objective |
|---|---|---|
| G1 | spec | Emit `job` artifacts (callable or schedulable) |
| G2 | spec | Emit `queue` declarations / bindings |
| G3 | spec | Wire workflow `dispatch` |
| G4 | spec | Wire workflow `notify` |
| G5 | spec | Wire workflow `emit` + `event` types |
| G6 | spec | Wire `lifecycle` hooks (`on` / `before` / `after`) |
| G7 | spec | Surface `ai_context` (emit, embed, or agent-facing artifact) |

### H — Quality

| ID | Scope | Objective |
|---|---|---|
| H1 | stretch | Human-readable API / domain documentation |
| H2 | stretch | Automated test fixtures or scaffolds |
| H3 | stretch | Golden / CI for `minimal.aip` (or matching twin) |
| H4 | stretch | Emit succeeds on matching full-tier examples without crash |
| H5 | spec | Naming aligned with docs (plural tables, `*_id`, snake_case) |

### I — Consumers

| ID | Scope | Objective |
|---|---|---|
| I1 | stretch | Typed API client / SDK (or codegen from the contract) |
| I2 | stretch | Contract↔runtime parity story (shared paths/types or CI check) |

### J — Ops & config

| ID | Scope | Objective |
|---|---|---|
| J1 | stretch | Config/env for DB URL and secrets (no hardcoding) |
| J2 | stretch | Minimal observability (request id and/or structured logs) |
| J3 | stretch | Health/readiness endpoint or worker liveness hook |

**Item count:** **55** master IDs (A1–J3). Applicable count varies by role.

---

## Per-emitter scorecards

| Emitter | Role | Scorecard |
|---|---|---|
| PostgreSQL | `schema` | [`transpilers/sql/EMITTER_OBJECTIVES.md`](transpilers/sql/EMITTER_OBJECTIVES.md) |
| MySQL | `schema` | [`transpilers/mysql/EMITTER_OBJECTIVES.md`](transpilers/mysql/EMITTER_OBJECTIVES.md) |
| OpenAPI | `contract` | [`transpilers/openapi/EMITTER_OBJECTIVES.md`](transpilers/openapi/EMITTER_OBJECTIVES.md) |
| TypeScript | `app` | [`transpilers/typescript/EMITTER_OBJECTIVES.md`](transpilers/typescript/EMITTER_OBJECTIVES.md) |
| Go | `app` | [`transpilers/go/EMITTER_OBJECTIVES.md`](transpilers/go/EMITTER_OBJECTIVES.md) |
| Python | `app` | [`transpilers/python/EMITTER_OBJECTIVES.md`](transpilers/python/EMITTER_OBJECTIVES.md) |
| PHP | `app` | [`transpilers/php/EMITTER_OBJECTIVES.md`](transpilers/php/EMITTER_OBJECTIVES.md) |
| Workers | `workers` | [`transpilers/workers/EMITTER_OBJECTIVES.md`](transpilers/workers/EMITTER_OBJECTIVES.md) |
| Docs | `docs` | [`transpilers/docs/EMITTER_OBJECTIVES.md`](transpilers/docs/EMITTER_OBJECTIVES.md) |
| Tests | `tests` | [`transpilers/tests/EMITTER_OBJECTIVES.md`](transpilers/tests/EMITTER_OBJECTIVES.md) |

---

## Scoreboard (v2 · 2026-08-08)

| Emitter | Role | Score | % | Band |
|---|---|---|---|---|
| PostgreSQL (sql) | schema | **17/23** | 74% | Strong slice |
| MySQL | schema | **14/23** | 61% | Strong slice |
| OpenAPI | contract | **20/33** | 61% | Strong slice |
| TypeScript | app | **25/55** | 45% | Useful Preview |
| Tests | tests | **7/18** | 39% | Useful Preview |
| Docs | docs | **13/38** | 34% | Useful Preview |
| Go | app | **12/55** | 22% | Stub / early app |
| Python | app | **12/55** | 22% | Stub / early app |
| PHP | app | **11/55** | 20% | Stub / early app |
| Workers | workers | **4/20** | 20% | Stub Preview |

**Bands (by applicable %):**

| Band | ✅ / applicable |
|---|---|
| Stub | &lt; 25% |
| Early / Useful Preview | 25–49% |
| Strong slice | 50–74% |
| Happy-path ready (role) | 75–89% |
| Role-complete | ≥ 90% |

Phase D: push **`app` (TS)** + **`contract`** + **`schema` (SQL)** so the [combined happy path](#combined-happy-path-phase-d-done) clears HP1–HP10 — not so one package hits 55/55.

---

## How to re-test

```bash
npm test
node packages/cli/dist/cli.js emit <target> examples/minimal.aip
node packages/cli/dist/cli.js emit <target> examples/blog-crud.aip   # mysql → mysql-minimal
```

1. Confirm the package **role**.  
2. Mark ➖ for sections outside the role matrix.  
3. For applicable IDs, inspect emit (and runtime if F/J).  
4. Update the package scorecard + this scoreboard.
