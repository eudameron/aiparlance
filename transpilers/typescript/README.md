# @aiparlance/typescript

TypeScript emitter (**app** role). Emits types, Zod schemas, policy helpers, and a thin CRUD HTTP app.

## Coverage

| Feature | Status |
|---|---|
| Interfaces + type guards | Yes |
| Zod schemas | Yes (`zod`) |
| Path helpers + `api.prefix` | Yes |
| Policy consts | Yes |
| In-memory CRUD | Yes (default without `DATABASE_URL`) |
| Postgres CRUD | Yes when `DATABASE_URL` / `store: "pg"` (`pg`) |
| JWT HS256 | Yes when `AIP_JWT_SECRET` (`jose`); else Bearer + `x-aip-*` Preview headers |
| Soft-delete filters | Yes |
| `api.cors` / `api.rate_limit` | Yes (reflect Origin; fixed-window 429) |
| Unique → 409 | Yes |
| List pagination | Yes (`?limit=&offset=` → `{ items, limit, offset, total }`) |
| Typed errors | Yes (`{ error: { code, message } }`) |
| `owner_or_manager` | Yes (owner **or** role `admin`\|`editor`) |
| `/health` | Yes (under `api.prefix`) |
| Env | `PORT`, `DATABASE_URL`, `AIP_JWT_SECRET` |

```bash
node packages/cli/dist/cli.js emit typescript examples/blog-crud.aip > app.ts
npm i zod pg jose
export DATABASE_URL=postgres://…   # optional
export AIP_JWT_SECRET=dev-secret   # recommended
npx tsx -e "import { listenCrudApp } from './app.ts'; listenCrudApp()"
```

Sign a token:

```ts
import { signCrudToken } from "./app.ts";
const jwt = await signCrudToken({ sub: "<author-uuid>", role: "admin" });
```

See [`ROADMAP.md`](../../ROADMAP.md) and [`EMITTER_OBJECTIVES.md`](EMITTER_OBJECTIVES.md).
