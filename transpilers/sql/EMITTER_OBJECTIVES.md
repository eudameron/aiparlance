# Emitter Objectives — `@aiparlance/sql`

**CLI:** `aip emit sql` · **Role:** `schema`  
**Score: 19/23** (83%) · Band: Happy-path ready  
**Master:** [`EMITTER_OBJECTIVES.md`](../../EMITTER_OBJECTIVES.md) (v2)  
**Scored:** 2026-08-08 (D2.5)

| Mark | Count |
|---|---|
| ✅ Pass | 19 |
| ⚠️ Partial | 0 |
| ❌ Fail | 4 |
| ➖ N/A | 32 |

---

## A — Domain model

| ID | Status | Notes |
|---|---|---|
| A1 | ✅ | `CREATE TABLE` |
| A2 | ➖ | app/contract |
| A3 | ➖ | app/contract |
| A4 | ✅ | `CHECK` |
| A5 | ✅ | FK `*_id` |
| A6 | ✅ | |
| A7 | ✅ | |
| A8 | ✅ | `deleted_at` column |
| A9 | ✅ | `{table}_active` views filter `deleted_at IS NULL` |

## B — Validation

| ID | Status | Notes |
|---|---|---|
| B1 | ✅ | `NOT NULL` |
| B2 | ✅ | `UNIQUE` |
| B3 | ❌ | |
| B4 | ✅ | `email` → `CITEXT` (+ citext extension) |

## C — Persistence

| ID | Status | Notes |
|---|---|---|
| C1 | ✅ | |
| C2 | ✅ | |
| C3 | ✅ | |
| C4 | ✅ | `emitSqlMigrations` → `0001_init.up.sql` |
| C5 | ✅ | `emitSqlDown` / `0001_init.down.sql` |
| C6 | ✅ | `postgres` only |
| C7 | ❌ | |

## D — HTTP

| ID | Status |
|---|---|
| D1–D7 | ➖ |

## E — Auth & policy

| ID | Status |
|---|---|
| E1–E6 | ➖ |

## F — Runtime

| ID | Status |
|---|---|
| F1–F5 | ➖ |

## G — Behavior

| ID | Status |
|---|---|
| G1–G7 | ➖ |

## H — Quality

| ID | Status | Notes |
|---|---|---|
| H1 | ❌ | |
| H2 | ❌ | |
| H3 | ✅ | |
| H4 | ✅ | postgres examples |
| H5 | ✅ | |

## I — Consumers

| ID | Status |
|---|---|
| I1–I2 | ➖ |

## J — Ops

| ID | Status |
|---|---|
| J1–J3 | ➖ |

---

## Next

1. B3 — CHECKs from `validation { }` beyond UNIQUE/required  
2. C7 — transaction helpers for multi-statement seeds/workflows  
3. H1/H2 — COMMENT ON / fixture SQL
