# Emitter Objectives — `@aiparlance/go`

**CLI:** `aip emit go` · **Role:** `app`  
**Score: 12/55** (22%) · Band: Stub / early app Preview  
**Master:** [`EMITTER_OBJECTIVES.md`](../../EMITTER_OBJECTIVES.md) (v2)  
**Scored:** 2026-08-06

| Mark | Count |
|---|---|
| ✅ Pass | 12 |
| ⚠️ Partial | 9 |
| ❌ Fail | 34 |
| ➖ N/A | 0 |

---

## A — Domain model

| ID | Status |
|---|---|
| A1–A8 | ✅ |
| A9 | ❌ |

## B — Validation

| ID | Status | Notes |
|---|---|---|
| B1 | ✅ | |
| B2 | ❌ | |
| B3 | ⚠️ | |
| B4 | ⚠️ | |

## C — Persistence

| ID | Status |
|---|---|
| C1–C7 | ❌ |

## D — HTTP / API surface

| ID | Status | Notes |
|---|---|---|
| D1 | ⚠️ | handlers exist, 501 |
| D2 | ❌ | |
| D3 | ❌ | |
| D4 | ❌ | |
| D5 | ❌ | |
| D6 | ❌ | |
| D7 | ❌ | |

## E — Auth & policy

| ID | Status | Notes |
|---|---|---|
| E1 | ⚠️ | presence-only middleware |
| E2 | ⚠️ | |
| E3–E6 | ❌ | |

## F — Runtime

| ID | Status | Notes |
|---|---|---|
| F1 | ❌ | no `main` |
| F2 | ⚠️ | 501 |
| F3–F5 | ❌ | |

## G — Behavior

| ID | Status |
|---|---|
| G1–G7 | ❌ |

## H — Quality

| ID | Status |
|---|---|
| H1–H2 | ❌ |
| H3–H5 | ✅ |

## I — Consumers · J — Ops

| ID | Status |
|---|---|
| I1–I2 | ❌ |
| J1–J3 | ❌ |

---

## Next (Phase D P1)

Mirror TS happy path after P0: real handlers, DB, verified auth, prefix, policies.
