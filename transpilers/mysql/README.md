# @aiparlance/mysql

MySQL DDL emitter (secondary SQL target after PostgreSQL).

```ts
import { emitMysql } from "@aiparlance/mysql";

process.stdout.write(emitMysql(doc));
```

Requires `app { database mysql }`. If the app targets postgres, throws and suggests `aip emit sql`.

Notes:

- `uuid` → `CHAR(36)` with `DEFAULT (UUID())`
- timestamps → `DATETIME(6)`
- `CREATE INDEX` + `seed` `INSERT` when present

Status: **MVP Preview** · Phase D P1 (migration parity after Postgres deepen).

See [`ROADMAP.md`](../../ROADMAP.md) and [`EMITTER_OBJECTIVES.md`](EMITTER_OBJECTIVES.md) (**14/23** schema).
