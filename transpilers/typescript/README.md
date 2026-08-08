# @aiparlance/typescript

TypeScript emitter (**app** role). Phase D emits types, Zod schemas, policy helpers, and a thin in-memory CRUD HTTP app.

## Coverage

| Feature | Status |
|---|---|
| Interfaces `Entity` / `Create` / `Update` | Yes |
| Type guards | Yes |
| Zod schemas (`*CreateSchema`, …) | Yes (peer: `zod`) |
| Path helpers + `api.prefix` | Yes |
| Policy consts from `.aip` | Yes |
| Runnable CRUD (`createCrudApp`) | Yes (in-memory Preview) |
| Soft-delete on list/get/delete | Yes (memory store) |
| Auth headers (Bearer + `x-aip-user-id` / `x-aip-role`) | Yes (Preview) |
| Real Postgres / JWT crypto | Not yet |

```bash
node packages/cli/dist/cli.js emit typescript examples/blog-crud.aip > app.ts
# requires: npm i zod
# then: npx tsx -e "import { listenCrudApp } from './app.ts'; listenCrudApp()"
```

See [`ROADMAP.md`](../../ROADMAP.md) and [`EMITTER_OBJECTIVES.md`](EMITTER_OBJECTIVES.md) (**25/55**).
