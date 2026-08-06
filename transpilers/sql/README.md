# @aiparlance/sql

PostgreSQL DDL emitter (**primary** SQL target). Phase C / M3 MVP; Infra follow-up added indexes and seeds. **Phase D** deepens migrations.

## Coverage

| Feature | Status |
|---|---|
| `CREATE TABLE` + implicit `id` / timestamps | Yes |
| `required` / `unique` / `default` | Yes |
| `enum(…)` → `CHECK` | Yes |
| `belongs_to` → `*_id` FK | Yes |
| `soft_delete` → `deleted_at` | Yes |
| `index` → `CREATE INDEX` | Yes |
| `seed` → `INSERT` | Yes |
| Versioned migrations UX | Phase D |
| MySQL dialect | Use `@aiparlance/mysql` |

```bash
node packages/cli/dist/cli.js emit sql examples/blog-crud.aip
```

```ts
import { parse } from "@aiparlance/parser";
import { validate } from "@aiparlance/validator";
import { emitSql } from "@aiparlance/sql";

const doc = parse(source, "minimal.aip");
if (!validate(doc).ok) throw new Error("invalid");
console.log(emitSql(doc));
```

See [`ROADMAP.md`](../../ROADMAP.md) (Phase D · P0 deepen SQL) and [`EMITTER_OBJECTIVES.md`](EMITTER_OBJECTIVES.md) (**15/23** schema).
