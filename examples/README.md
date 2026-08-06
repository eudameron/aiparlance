# Examples

Reference AI Parlance (`.aip`) specs for learning, validation, and emitter tests.

| File | Description | CI (Core tier) |
|---|---|---|
| [minimal.aip](minimal.aip) | Smallest valid v0.1 spec (`app` + one entity + CRUD) | **Must** validate + SQL / OpenAPI / TypeScript goldens |
| [crm-reference.aip](crm-reference.aip) | CRM with users, leads, tasks, policies, API, and workflows | Reference doc — parse stops at Security/Behavior (`unsupported_tier`) until those tiers ship |
| [ops-reference.aip](ops-reference.aip) | Infra + Behavior extras: `timestamps`/`soft_delete`, `seed`, `validation`, `lifecycle`, `job`, `queue`, `ai_context`, `if`/`reject`/`dispatch` | Reference doc — parse stops at Infra/Behavior (`unsupported_tier`) until those tiers ship |

Documented at [docs.aiparlance.org](https://docs.aiparlance.org) · [source on GitHub](https://github.com/eudameron/aiparlance/tree/main/examples).

Normative grammar: [spec/v0.1/grammar.ebnf](../spec/v0.1/grammar.ebnf).

```bash
# from repo root
npm test                 # includes scripts/examples.test.ts
npm run check:examples
node packages/cli/dist/cli.js validate examples/minimal.aip
```
