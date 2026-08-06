# Emitter Objectives — `@aiparlance/openapi`

**CLI:** `aip emit openapi` · **Role:** `contract`  
**Score: 16/33** (48%) · Band: Useful Preview  
**Master:** [`EMITTER_OBJECTIVES.md`](../../EMITTER_OBJECTIVES.md) (v2)  
**Scored:** 2026-08-06

| Mark | Count |
|---|---|
| ✅ Pass | 16 |
| ⚠️ Partial | 3 |
| ❌ Fail | 14 |
| ➖ N/A | 21 |

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
| E2 | ⚠️ | not per-operation from policy |
| E3 | ❌ | |
| E4 | ❌ | |
| E5 | ❌ | |
| E6 | ❌ | |

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

- **E2–E6** — policy → per-operation security + 401/403 responses  
- **D3–D6** — cors, rate_limit, pagination, error schemas  
- **I2** — parity check vs TS happy path
