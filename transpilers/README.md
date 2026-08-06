# Transpilers

Code generators that turn AI Parlance (`.aip`) into target stacks.

**Implementation order:** see [`ROADMAP.md`](../ROADMAP.md) (Phase C).  
**Matrix (docs):** [Specification § Transpiler matrix](https://docs.aiparlance.org/en/specification#transpiler-matrix).

## Planned layout

```text
transpilers/
├── sql/           # PostgreSQL first (primary), MySQL later
├── openapi/       # paths, schemas, security
├── typescript/    # interfaces, guards (first application backend)
├── go/            # second application backend (after TypeScript)
├── python/        # later
└── php/           # later
```

Input: **validated AST** from the TypeScript toolchain (`packages/parser`, `packages/validator`) — not the marketing playground.

Reference fixtures: [examples/minimal.aip](../examples/minimal.aip), [crm-reference.aip](../examples/crm-reference.aip), [ops-reference.aip](../examples/ops-reference.aip).
