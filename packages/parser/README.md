# @aiparlance/parser

Lexer + parser for AI Parlance `.aip` → AST.

| | |
|---|---|
| Status | **Scaffold (M0)** — not implemented |
| Next | **M1** — Core parse (`app`, `entity`, `crud`, …) |
| Grammar | [`spec/v0.1/grammar.ebnf`](../../spec/v0.1/grammar.ebnf) |

```ts
import { parse } from "@aiparlance/parser";

const doc = parse(source, "minimal.aip");
```

See [`ROADMAP.md`](../../ROADMAP.md).
