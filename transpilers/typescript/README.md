# @aiparlance/typescript

TypeScript interfaces + type guards emitter (first application backend). Phase C / M5 MVP. **Phase D** deepens toward Zod / runnable CRUD / policy guards.

```ts
import { parse } from "@aiparlance/parser";
import { emitTypeScript } from "@aiparlance/typescript";

const doc = parse(source, "app.aip");
process.stdout.write(emitTypeScript(doc));
```

Or via CLI: `aip emit typescript examples/blog-crud.aip`

Emits per entity:

- `Entity` / `EntityCreate` / `EntityUpdate` interfaces
- `isEntity` / `isEntityCreate` type guards (zero runtime deps)
- Thin `entityPaths` helpers when `crud Entity` is declared

Status: **Preview** · Phase D P0 deepen target.

See [`ROADMAP.md`](../../ROADMAP.md).
