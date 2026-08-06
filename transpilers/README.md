# Transpilers

Code generators that turn validated AI Parlance AST into target stacks.

**Implementation order:** [`ROADMAP.md`](../ROADMAP.md) (Phase C).  
**Matrix:** [Specification § Transpiler matrix](https://docs.aiparlance.org/en/specification#transpiler-matrix).

## Layout

```text
transpilers/
├── sql/           # @aiparlance/sql — PostgreSQL (M3)
├── openapi/       # @aiparlance/openapi — OpenAPI 3.x (M4)
├── typescript/    # @aiparlance/typescript — interfaces/guards (M5)
└── go/            # follow-up after TypeScript
```

Input: **validated AST** from `@aiparlance/parser` + `@aiparlance/validator` — not the marketing playground.

Fixtures: [examples/minimal.aip](../examples/minimal.aip), [crm-reference.aip](../examples/crm-reference.aip), [ops-reference.aip](../examples/ops-reference.aip).
