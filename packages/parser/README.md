# @aiparlance/parser

Lexer + parser for AI Parlance `.aip` → AST.

| | |
|---|---|
| Status | **M1** — Core implemented |
| Coverage | `app`, `entity`, fields (`primitive` / `enum` / `belongs_to` / entity ref), modifiers, `crud`, `validation`, `timestamps` / `soft_delete` |
| Deferred | Infra / Security / Behavior blocks → `unsupported_tier` error |
| Grammar | [`spec/v0.1/grammar.ebnf`](../../spec/v0.1/grammar.ebnf) |

```ts
import { parse } from "@aiparlance/parser";

const doc = parse(source, "minimal.aip");
```

```bash
# from repo root (after build)
node packages/cli/dist/cli.js parse examples/minimal.aip
```

See [`ROADMAP.md`](../../ROADMAP.md).
