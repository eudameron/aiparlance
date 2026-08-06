# Emitter Objectives — `@aiparlance/typescript`

**CLI:** `aip emit typescript` · **Role:** `app`  
**Score: 12/55** (22%) · Band: Stub / early app Preview  
**Master:** [`EMITTER_OBJECTIVES.md`](../../EMITTER_OBJECTIVES.md) (v2)  
**Scored:** 2026-08-06

| Mark | Count |
|---|---|
| ✅ Pass | 12 |
| ⚠️ Partial | 5 |
| ❌ Fail | 38 |
| ➖ N/A | 0 |

All master sections apply to `app` (including C and G as future ownership).

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
| A8 | ✅ | field only |
| A9 | ❌ | |

## B — Validation

| ID | Status | Notes |
|---|---|---|
| B1 | ✅ | |
| B2 | ❌ | |
| B3 | ⚠️ | required-only |
| B4 | ⚠️ | |

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
| D1 | ⚠️ | `entityPaths` only |
| D2 | ❌ | ignores prefix |
| D3 | ❌ | |
| D4 | ❌ | |
| D5 | ❌ | |
| D6 | ❌ | |
| D7 | ❌ | |

## E — Auth & policy

| ID | Status | Notes |
|---|---|---|
| E1 | ❌ | |
| E2 | ❌ | |
| E3 | ❌ | |
| E4 | ❌ | |
| E5 | ❌ | |
| E6 | ❌ | |

## F — Runtime

| ID | Status | Notes |
|---|---|---|
| F1 | ❌ | **P0** |
| F2 | ❌ | **P0** |
| F3 | ❌ | **P0** |
| F4 | ❌ | Zod path |
| F5 | ❌ | |

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
| J1 | ❌ | |
| J2 | ❌ | |
| J3 | ❌ | |

---

## Next (Phase D P0)

Clear [combined happy path](../../EMITTER_OBJECTIVES.md#combined-happy-path-phase-d-done) items HP4–HP8 via:

1. F1–F3 runnable CRUD + DB  
2. F4 / B3 Zod (or equivalent)  
3. E\* / F5 policies  
4. D2 prefix · A9 soft-delete reads · J1 config
