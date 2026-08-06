# @aiparlance/validator

Semantic checks on a parsed AST (Specification § Validation — Core subset).

| | |
|---|---|
| Status | **M2** — Core rules implemented |
| Depends on | `@aiparlance/parser` |

```ts
import { parse } from "@aiparlance/parser";
import { validate, formatDiagnostic } from "@aiparlance/validator";

const doc = parse(source, "minimal.aip");
const result = validate(doc);
if (!result.ok) {
  for (const d of result.diagnostics) console.error(formatDiagnostic(d, "minimal.aip"));
}
```

```bash
node packages/cli/dist/cli.js validate examples/minimal.aip
```

See [`ROADMAP.md`](../../ROADMAP.md).
