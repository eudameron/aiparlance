# Transpilers

Code generators that turn AI Parlance (`.aip`) into target stacks.

Planned targets (v0.1):

- PostgreSQL / MySQL (DDL, migrations)
- Go, TypeScript, Python, PHP
- OpenAPI
- Workers (queues, jobs)

Each transpiler will live in its own subdirectory when implemented, for example:

```text
transpilers/
├── go/
├── typescript/
├── sql/
└── openapi/
```

Input: parsed AST from [spec/v0.1/](../spec/v0.1/). Reference spec: [examples/crm-reference.aip](../examples/crm-reference.aip).
