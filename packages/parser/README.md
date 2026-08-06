# @aiparlance/parser

Lexer + parser for AI Parlance `.aip` → AST.

| | |
|---|---|
| Status | Core + Infra + Security + Behavior (v0.1) |
| Coverage | `app`, `entity`, `crud`, `validation`, `index`, `api`, `seed`, `policy`, `workflow`, `event`, `lifecycle`, `job`, `queue`, `ai_context`, field modifiers, `timestamps` / `soft_delete` |
| Grammar | [`spec/v0.1/grammar.ebnf`](../../spec/v0.1/grammar.ebnf) |

```ts
import { parse } from "@aiparlance/parser";

const doc = parse(source, "minimal.aip");
```

```bash
node packages/cli/dist/cli.js parse examples/crm-reference.aip
```

See [`ROADMAP.md`](../../ROADMAP.md).
