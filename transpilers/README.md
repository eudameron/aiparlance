# Transpilers

Code generators that turn validated AI Parlance AST into target stacks.

```text
transpilers/
├── sql/           PostgreSQL DDL (+ index/seed)
├── mysql/         MySQL DDL
├── openapi/       OpenAPI 3.x
├── typescript/    interfaces + guards
├── go/            structs + handlers
├── python/        dataclasses
├── php/           classes
├── workers/       jobs / queues
├── docs/          Markdown API reference
└── tests/         CRUD test fixtures
```

```bash
node packages/cli/dist/cli.js emit sql examples/minimal.aip
node packages/cli/dist/cli.js emit workers examples/ops-reference.aip
```

See [`ROADMAP.md`](../ROADMAP.md) and the [transpiler matrix](https://docs.aiparlance.org/en/specification#transpiler-matrix).
