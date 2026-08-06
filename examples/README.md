# Examples

Reference AI Parlance (`.aip`) specs for learning, validation, and emitter tests.

| File | Description | CI |
|---|---|---|
| [minimal.aip](minimal.aip) | Smallest valid v0.1 Core spec | validate + SQL / OpenAPI / TS / Go goldens |
| [crm-reference.aip](crm-reference.aip) | CRM with policies, indexes, API, workflows, events | validate (Infra/Security/Behavior) |
| [ops-reference.aip](ops-reference.aip) | Seed, ai_context, jobs, queues, lifecycle | validate + SQL seeds |

```bash
npm test
node packages/cli/dist/cli.js validate examples/crm-reference.aip
node packages/cli/dist/cli.js emit workers examples/ops-reference.aip
```

Normative grammar: [spec/v0.1/grammar.ebnf](../spec/v0.1/grammar.ebnf).
