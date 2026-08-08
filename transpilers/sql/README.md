# @aiparlance/sql

PostgreSQL DDL emitter (**primary** SQL target). Phase D adds a versioned migration workflow.

## Coverage

| Feature | Status |
|---|---|
| `CREATE TABLE` + implicit `id` / timestamps | Yes |
| `required` / `unique` / `default` | Yes |
| `enum(…)` → `CHECK` | Yes |
| `belongs_to` → `*_id` FK | Yes |
| `soft_delete` → `deleted_at` | Yes |
| Soft-delete `{table}_active` views | Yes |
| `email` → `CITEXT` | Yes |
| `index` → `CREATE INDEX` | Yes |
| `seed` → `INSERT` | Yes |
| Versioned migrations (`0001_init.up/down`) | Yes (Preview) |
| MySQL | Use `@aiparlance/mysql` |

## Migration workflow

`aip emit sql` prints the **up** script (DDL + indexes + seeds) — treat it as `migrations/0001_init.up.sql`.

```bash
# Up only (default)
node packages/cli/dist/cli.js emit sql examples/blog-crud.aip > migrations/0001_init.up.sql

# Up + down bundle (split on the `=== file:` markers)
node packages/cli/dist/cli.js emit sql --migrations examples/blog-crud.aip
```

Apply with your runner of choice (`psql`, Flyway, golang-migrate, etc.):

```bash
psql "$DATABASE_URL" -f migrations/0001_init.up.sql
psql "$DATABASE_URL" -f migrations/0001_init.down.sql   # rollback
```

Later revisions are hand-authored or re-emitted as `0002_*.sql` — the emitter always produces a full init snapshot for the current `.aip`.

```ts
import { parse } from "@aiparlance/parser";
import { validate } from "@aiparlance/validator";
import { emitSql, emitSqlDown, emitSqlMigrations } from "@aiparlance/sql";

const doc = parse(source, "minimal.aip");
if (!validate(doc).ok) throw new Error("invalid");
console.log(emitSql(doc));
console.log(emitSqlDown(doc));
console.log(emitSqlMigrations(doc));
```

See [`ROADMAP.md`](../../ROADMAP.md) (Phase D · P0 deepen SQL) and [`EMITTER_OBJECTIVES.md`](EMITTER_OBJECTIVES.md) (**17/23** schema).
