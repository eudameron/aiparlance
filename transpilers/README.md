# Transpilers

Code generators that turn validated AI Parlance AST into target stacks.

**Matrix:** [Specification § Transpiler matrix](https://docs.aiparlance.org/en/specification#transpiler-matrix).  
**Roadmap:** [`ROADMAP.md`](../ROADMAP.md).

## Layout

```text
transpilers/
├── sql/           # @aiparlance/sql — PostgreSQL (Preview)
├── openapi/       # @aiparlance/openapi — OpenAPI 3.x (Preview)
├── typescript/    # @aiparlance/typescript — interfaces/guards (Preview)
└── go/            # @aiparlance/go — structs/handlers/JWT stubs (Preview)
```

Input: **validated AST** from `@aiparlance/parser` + `@aiparlance/validator` — not the marketing playground.

```bash
node packages/cli/dist/cli.js emit go examples/minimal.aip
```
