# @aiparlance/sql

PostgreSQL DDL emitter (**primary** SQL target — Phase C / M3).

## Coverage

| Feature | Status |
|---|---|
| `CREATE TABLE` + implicit `id` / timestamps | Yes |
| `required` / `unique` / `default` | Yes |
| `enum(…)` → `CHECK` | Yes |
| `belongs_to` → `*_id` FK | Yes |
| `soft_delete` → `deleted_at` | Yes |
| `index` / `seed` blocks | Deferred (Infra parse) |
| MySQL | Deferred |

```bash
node packages/cli/dist/cli.js emit sql examples/minimal.aip
```

```ts
import { parse } from "@aiparlance/parser";
import { validate } from "@aiparlance/validator";
import { emitSql } from "@aiparlance/sql";

const doc = parse(source, "minimal.aip");
if (!validate(doc).ok) throw new Error("invalid");
console.log(emitSql(doc));
```

See [`ROADMAP.md`](../../ROADMAP.md).
