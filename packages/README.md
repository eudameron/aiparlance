# Packages

Reference toolchain (TypeScript). See [`ROADMAP.md`](../ROADMAP.md).

| Package | Role | Milestone |
|---|---|---|
| [`@aiparlance/parser`](parser/) | `.aip` → AST | M1 |
| [`@aiparlance/validator`](validator/) | Semantic MUST rules | M2 |
| [`@aiparlance/cli`](cli/) | `aip` CLI | M1–M6 |

From repo root:

```bash
npm ci
npm run typecheck && npm run build && npm test
```
