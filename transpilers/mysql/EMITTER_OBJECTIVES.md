# Emitter Objectives — `@aiparlance/mysql`

**CLI:** `aip emit mysql` · **Role:** `schema`  
**Score: 14/23** (61%) · Band: Strong slice  
**Master:** [`EMITTER_OBJECTIVES.md`](../../EMITTER_OBJECTIVES.md) (v2)  
**Scored:** 2026-08-06

| Mark | Count |
|---|---|
| ✅ Pass | 14 |
| ⚠️ Partial | 2 |
| ❌ Fail | 7 |
| ➖ N/A | 31 |

---

## A — Domain model

| ID | Status | Notes |
|---|---|---|
| A1 | ✅ | |
| A2 | ➖ | |
| A3 | ➖ | |
| A4 | ✅ | |
| A5 | ✅ | |
| A6 | ✅ | |
| A7 | ✅ | |
| A8 | ✅ | |
| A9 | ❌ | |

## B — Validation

| ID | Status | Notes |
|---|---|---|
| B1 | ✅ | |
| B2 | ✅ | |
| B3 | ❌ | |
| B4 | ⚠️ | |

## C — Persistence

| ID | Status | Notes |
|---|---|---|
| C1 | ✅ | |
| C2 | ✅ | |
| C3 | ✅ | |
| C4 | ❌ | |
| C5 | ❌ | |
| C6 | ✅ | `mysql` only |
| C7 | ❌ | |

## D–G, I–J

| Section | Status |
|---|---|
| D, E, F, G, I, J | ➖ (not schema role) |

## H — Quality

| ID | Status | Notes |
|---|---|---|
| H1 | ❌ | |
| H2 | ❌ | |
| H3 | ✅ | |
| H4 | ⚠️ | mysql-gated (mysql examples only) |
| H5 | ✅ | |

---

## Next

- C4/C5 parity with PostgreSQL migrations  
- More mysql fixtures for H4 → ✅
