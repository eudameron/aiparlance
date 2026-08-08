# Emitter Objectives — `@aiparlance/typescript`

**CLI:** `aip emit typescript` · **Role:** `app`  
**Score: 25/55** (45%) · Band: Useful Preview  
**Master:** [`EMITTER_OBJECTIVES.md`](../../EMITTER_OBJECTIVES.md) (v2)  
**Scored:** 2026-08-08

| Mark | Count |
|---|---|
| ✅ Pass | 25 |
| ⚠️ Partial | 6 |
| ❌ Fail | 24 |
| ➖ N/A | 0 |

All master sections apply to `app` (including C and G as future ownership).  
Peer dependency: **`zod`** (emitted schemas + runtime validation).

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
| A9 | ⚠️ | in-memory list/get filters `deleted_at`; no durable DB |

## B — Validation

| ID | Status | Notes |
|---|---|---|
| B1 | ✅ | |
| B2 | ❌ | unique not enforced in Zod / store |
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
| D3 | ⚠️ | always-on CORS `*`; ignores `api.cors` |
| D4 | ❌ | |
| D5 | ❌ | |
| D6 | ⚠️ | stable `{ error }` JSON; not a full typed catalog |
| D7 | ✅ | JSON |

## E — Auth & policy

| ID | Status | Notes |
|---|---|---|
| E1 | ⚠️ | header actor (`Authorization` / `x-aip-*`); no JWT verify |
| E2 | ✅ | middleware-style checks in CRUD app |
| E3 | ✅ | policy consts + runtime allow |
| E4 | ✅ | `public` / `authenticated` / `role(…)` |
| E5 | ⚠️ | `owner` wired; `owner_or_manager` incomplete |
| E6 | ✅ | 401 vs 403 |

## F — Runtime

| ID | Status | Notes |
|---|---|---|
| F1 | ✅ | `createCrudApp` / `listenCrudApp` |
| F2 | ✅ | real in-memory CRUD (not 501 stubs) |
| F3 | ⚠️ | in-memory `Map`; not Postgres |
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
| J1 | ❌ | `PORT` only; no DB URL |
| J2 | ❌ | |
| J3 | ❌ | |

---

## Next (Phase D)

Clear [combined happy path](../../EMITTER_OBJECTIVES.md#combined-happy-path-phase-d-done) HP3–HP8 with real DB/JWT:

1. F3 — Postgres (or generated query layer) instead of in-memory  
2. E1 — verify JWT / api_key per `app.auth`  
3. E5 / A9 / D3 / D6 deepen  
4. J1 config · I2 parity with OpenAPI
