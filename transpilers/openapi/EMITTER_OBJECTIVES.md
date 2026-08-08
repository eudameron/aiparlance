# Emitter Objectives — `@aiparlance/openapi`

**CLI:** `aip emit openapi` · **Role:** `contract`  
**Score: 20/33** (61%) · Band: Strong slice  
**Master:** [`EMITTER_OBJECTIVES.md`](../../EMITTER_OBJECTIVES.md) (v2)  
**Scored:** 2026-08-08

| Mark | Count |
|---|---|
| ✅ Pass | 20 |
| ⚠️ Partial | 3 |
| ❌ Fail | 10 |
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
| A9 | ❌ | no soft-delete read semantics in contract |

## B — Validation

| ID | Status | Notes |
|---|---|---|
| B1 | ✅ | |
| B2 | ⚠️ | |
| B3 | ❌ | |
| B4 | ⚠️ | |

## C — Persistence

| ID | Status |
|---|---|
| C1–C7 | ➖ |

## D — HTTP / API surface

| ID | Status | Notes |
|---|---|---|
| D1 | ✅ | full CRUD paths |
| D2 | ✅ | `api.prefix` |
| D3 | ❌ | cors |
| D4 | ❌ | rate_limit |
| D5 | ❌ | pagination |
| D6 | ❌ | typed errors |
| D7 | ✅ | JSON |

## E — Auth & policy

| ID | Status | Notes |
|---|---|---|
| E1 | ✅ | securitySchemes |
| E2 | ✅ | per-operation `security` from policy + auth |
| E3 | ✅ | policy create/read/update/delete → operation security |
| E4 | ✅ | `public` / `authenticated` / `role(…)` (+ `x-aip-policy`) |
| E5 | ⚠️ | `owner` / `owner_or_manager` documented; no full ownership model |
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
| I2 | ❌ | no CI parity with runtime yet |

## J — Ops

| ID | Status |
|---|---|
| J1–J3 | ➖ |

---

## Next (Phase D / contract)

- **E5** — richer owner / owner_or_manager modeling when language allows  
- **D3–D6** — cors, rate_limit, pagination, error schemas  
- **I2** — parity check vs TS happy path
