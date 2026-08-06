# @aiparlance/typescript

TypeScript interfaces + type guards emitter (first application backend).

```ts
import { parse } from "@aiparlance/parser";
import { emitTypeScript } from "@aiparlance/typescript";

const doc = parse(source, "app.aip");
process.stdout.write(emitTypeScript(doc));
```

Or via CLI: `aip emit typescript examples/minimal.aip`

Emits per entity:

- `Entity` / `EntityCreate` / `EntityUpdate` interfaces
- `isEntity` / `isEntityCreate` type guards (zero runtime deps)
- Thin `entityPaths` helpers when `crud Entity` is declared

Status: Phase C / **M5**.
