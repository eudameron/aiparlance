# Emitter Objectives — `@aiparlance/workers`

**CLI:** `aip emit workers` · **Role:** `workers`  
**Score: 4/20** (20%) · Band: Stub Preview  
**Master:** [`EMITTER_OBJECTIVES.md`](../../EMITTER_OBJECTIVES.md) (v2)  
**Scored:** 2026-08-06

| Mark | Count |
|---|---|
| ✅ Pass | 4 |
| ⚠️ Partial | 3 |
| ❌ Fail | 13 |
| ➖ N/A | 34 |

---

## A–E, C, D, I

| Section | Status |
|---|---|
| A, B, C, D, E, I | ➖ |

## F — Runtime (worker)

| ID | Status | Notes |
|---|---|---|
| F1 | ❌ | no worker bootstrap |
| F2 | ⚠️ | handlers throw |
| F3 | ❌ | |
| F4 | ❌ | |
| F5 | ❌ | |

## G — Behavior

| ID | Status | Notes |
|---|---|---|
| G1 | ⚠️ | job stubs throw |
| G2 | ✅ | queue consts |
| G3 | ⚠️ | `dispatches` edges only |
| G4 | ❌ | notify |
| G5 | ❌ | emit/event |
| G6 | ❌ | lifecycle |
| G7 | ❌ | ai_context |

## H — Quality

| ID | Status |
|---|---|
| H1 | ❌ | |
| H2 | ❌ | |
| H3 | ✅ | |
| H4 | ✅ | |
| H5 | ✅ | |

## J — Ops

| ID | Status |
|---|---|
| J1–J3 | ❌ |

---

## Next (P1)

One concrete queue adapter (G1/F2), then G3–G7 and J1–J3.
