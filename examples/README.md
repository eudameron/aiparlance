# Examples

Reference AI Parlance (`.aip`) specs for learning, validation, and emitter tests.

| File | Description | CI |
|---|---|---|
| [minimal.aip](minimal.aip) | Smallest valid v0.1 Core spec | validate + SQL / OpenAPI / TS / Go goldens |
| [blog-crud.aip](blog-crud.aip) | Complete blog CRUD (policy, API, index, seed, workflow) | validate + OpenAPI `/v1` paths |
| [inventory-crud.aip](inventory-crud.aip) | Inventory + stock moves, jobs, queues | validate |
| [mysql-minimal.aip](mysql-minimal.aip) | MySQL smoke for `aip emit mysql` | validate |
| [crm-reference.aip](crm-reference.aip) | CRM with policies, indexes, API, workflows, events | validate (Infra/Security/Behavior) |
| [ops-reference.aip](ops-reference.aip) | Seed, ai_context, jobs, queues, lifecycle | validate + SQL seeds |

Docs walkthrough: [CRUD walkthrough](https://docs.aiparlance.org/en/crud-walkthrough).  
Docs menu: [Examples](https://docs.aiparlance.org/en/examples).

```bash
npm test
node packages/cli/dist/cli.js validate examples/blog-crud.aip
node packages/cli/dist/cli.js emit sql examples/blog-crud.aip
node packages/cli/dist/cli.js emit openapi examples/blog-crud.aip
node packages/cli/dist/cli.js emit mysql examples/mysql-minimal.aip
node packages/cli/dist/cli.js emit workers examples/inventory-crud.aip
```

Normative grammar: [spec/v0.1/grammar.ebnf](../spec/v0.1/grammar.ebnf).
