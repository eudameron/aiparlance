# Emitter Objectives — `@aiparlance/openapi`

**CLI:** `aip emit openapi` · **Role:** `contract`  
**Score: 28/33** (85%) · Band: Happy-path ready  
**Master:** [`EMITTER_OBJECTIVES.md`](../../EMITTER_OBJECTIVES.md) (v2)  
**Scored:** 2026-08-08 (D2.5)

| Mark | Count |
|---|---|
| ✅ Pass | 28 |
| ⚠️ Partial | 0 |
| ❌ Fail | 5 |
| ➖ N/A | 22 |

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
| A8 | ✅ | |
| A9 | ✅ | list/get descriptions + `x-aip-soft-delete` |

## B — Validation

| ID | Status | Notes |
|---|---|---|
| B1 | ✅ | |
| B2 | ✅ | 409 Conflict on create/update when unique fields exist |
| B3 | ❌ | |
| B4 | ✅ | `format: email` for email type |

## C — Persistence

| ID | Status |
|---|---|
| C1–C7 | ➖ |

## D — HTTP / API surface

| ID | Status | Notes |
|---|---|---|
| D1 | ✅ | full CRUD paths |
| D2 | ✅ | `api.prefix` |
| D3 | ✅ | `x-aip-cors` from `api.cors` |
| D4 | ✅ | `x-aip-rate-limit` + 429 response |
| D5 | ✅ | `limit`/`offset` query params + paginated schema |
| D6 | ✅ | shared `Error` schema + common responses |
| D7 | ✅ | JSON |

## E — Auth & policy

| ID | Status | Notes |
|---|---|---|
| E1 | ✅ | securitySchemes |
| E2 | ✅ | per-operation `security` from policy + auth |
| E3 | ✅ | policy create/read/update/delete → operation security |
| E4 | ✅ | `public` / `authenticated` / `role(…)` (+ `x-aip-policy`) |
| E5 | ✅ | `owner` / `owner_or_manager` scopes + manager roles documented |
| E6 | ✅ | 401/403 response docs on protected ops |

## F — Runtime · G — Behavior

| ID | Status |
|---|---|
| F1–F5 | ➖ |
| G1–G7 | ➖ |

## H — Quality

| ID | Status | Notes |
|---|---|---|
| H1 | ❌ | machine contract (use `docs`) |
| H2 | ❌ | |
| H3 | ✅ | |
| H4 | ✅ | |
| H5 | ✅ | |

## I — Consumers

| ID | Status | Notes |
|---|---|---|
| I1 | ❌ | no client SDK emit |
| I2 | ❌ | no full contract↔runtime CI matrix yet |

## J — Ops

| ID | Status |
|---|---|
| J1–J3 | ➖ |

---

## Next

1. B3 richer validation constraints in schema  
2. I2 parity CI with TypeScript happy path  
3. Optional H1 prose via `docs` emitter
