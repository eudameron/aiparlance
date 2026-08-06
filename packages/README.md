# Packages

Reference toolchain (TypeScript). See [`ROADMAP.md`](../ROADMAP.md).

| Package | Role | Milestone |
|---|---|---|
| [`@aiparlance/parser`](parser/) | `.aip` → AST (Core) | **M1 done** |
| [`@aiparlance/validator`](validator/) | Semantic MUST rules | **M2 done** |
| [`@aiparlance/cli`](cli/) | `aip` CLI (`parse`, `validate`, `emit sql\|openapi`) | M1–M6 |


From repo root:

```bash
npm ci
npm run typecheck && npm run build && npm test
```
