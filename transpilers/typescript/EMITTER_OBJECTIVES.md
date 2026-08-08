# Emitter Objectives — `@aiparlance/typescript`

**CLI:** `aip emit typescript` · **Role:** `app`  
**Score: 36/55** (65%) · Band: Strong slice  
**Master:** [`EMITTER_OBJECTIVES.md`](../../EMITTER_OBJECTIVES.md) (v2)  
**Scored:** 2026-08-08 (D2.5)

| Mark | Count |
|---|---|
| ✅ Pass | 36 |
| ⚠️ Partial | 0 |
| ❌ Fail | 19 |
| ➖ N/A | 0 |

All master sections apply to `app` (including C and G as future ownership).  
Peers: **`zod`**, **`pg`**, **`jose`**.

---

## A — Domain model

| ID | Status | Notes |
|---|---|---|
| A1 | ✅ | |
| A2 | ✅ | |
| A3 | ✅ | |
| A4 | ✅ | |
| A5 | ✅ | |
| A6 | ✅ | |
| A7 | ✅ | |
| A8 | ✅ | field + runtime soft-delete |
| A9 | ✅ | list/get filter `deleted_at` (memory + Postgres) |

## B — Validation

| ID | Status | Notes |
|---|---|---|
| B1 | ✅ | |
| B2 | ✅ | unique fields → 409 conflict (memory + PG 23505) |
| B3 | ✅ | Zod from `validation` + field rules |
| B4 | ✅ | e.g. `email` → `z.string().email()` |

## C — Persistence

| ID | Status | Notes |
|---|---|---|
| C1 | ❌ | no ORM/query layer yet |
| C2 | ❌ | |
| C3 | ❌ | |
| C4 | ❌ | |
| C5 | ❌ | |
| C6 | ❌ | |
| C7 | ❌ | |

## D — HTTP / API surface

| ID | Status | Notes |
|---|---|---|
| D1 | ✅ | full CRUD via `createCrudApp` |
| D2 | ✅ | `api.prefix` on paths + server |
| D3 | ✅ | `api.cors` reflect allowed Origin |
| D4 | ✅ | `api.rate_limit` fixed window → 429 |
| D5 | ✅ | list `?limit=&offset=` paginated envelope |
| D6 | ✅ | `{ error: { code, message } }` catalog |
| D7 | ✅ | JSON |

## E — Auth & policy

| ID | Status | Notes |
|---|---|---|
| E1 | ✅ | JWT HS256 via `jose` when `AIP_JWT_SECRET` |
| E2 | ✅ | middleware-style checks in CRUD app |
| E3 | ✅ | policy consts + runtime allow |
| E4 | ✅ | `public` / `authenticated` / `role(…)` |
| E5 | ✅ | `owner` + `owner_or_manager` (admin\|editor) |
| E6 | ✅ | 401 vs 403 |

## F — Runtime

| ID | Status | Notes |
|---|---|---|
| F1 | ✅ | `createCrudApp` / `listenCrudApp` |
| F2 | ✅ | real in-memory CRUD (not 501 stubs) |
| F3 | ✅ | Postgres via `pg` + `DATABASE_URL`; memory fallback |
| F4 | ✅ | Zod `safeParse` on create/update |
| F5 | ✅ | policy checks on routes |

## G — Behavior

| ID | Status | Notes |
|---|---|---|
| G1 | ❌ | |
| G2 | ❌ | |
| G3 | ❌ | |
| G4 | ❌ | |
| G5 | ❌ | |
| G6 | ❌ | |
| G7 | ❌ | |

## H — Quality

| ID | Status | Notes |
|---|---|---|
| H1 | ❌ | |
| H2 | ❌ | |
| H3 | ✅ | |
| H4 | ✅ | |
| H5 | ✅ | |

## I — Consumers

| ID | Status | Notes |
|---|---|---|
| I1 | ❌ | |
| I2 | ❌ | |

## J — Ops

| ID | Status | Notes |
|---|---|---|
| J1 | ✅ | `PORT`, `DATABASE_URL`, `AIP_JWT_SECRET` |
| J2 | ❌ | |
| J3 | ✅ | `/health` (+ prefix) |

---

## Next

1. C\* ORM / query layer or generated queries  
2. G\* Behavior wiring  
3. J2 structured logs · I1/I2 SDK + contract parity CI
