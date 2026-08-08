# @aiparlance/openapi

OpenAPI 3.0.3 emitter. Phase C / M4 MVP; Infra follow-up added `api.prefix`. **Phase D** deepens policy → security.

## Coverage

| Feature | Status |
|---|---|
| Entity schemas (+ Create/Update) | Yes |
| CRUD paths (honors `api.prefix`) | Yes |
| `app.auth` → securitySchemes | Yes |
| `api { prefix … }` | Yes |
| `policy` → per-operation security | Yes (Preview) |
| `api.cors` / `api.rate_limit` | Yes (`x-aip-*` + 429) |
| Soft-delete read semantics | Yes (`x-aip-soft-delete` + descriptions) |
| Pagination query params | Yes (`limit` / `offset`) |
| Shared `Error` schema | Yes (400/401/403/404/409/429) |
| `owner_or_manager` scopes | Yes (admin\|editor\|owner) |

```bash
node packages/cli/dist/cli.js emit openapi examples/blog-crud.aip
```

See [`ROADMAP.md`](../../ROADMAP.md) (Phase D · P0 deepen OpenAPI) and [`EMITTER_OBJECTIVES.md`](EMITTER_OBJECTIVES.md) (**28/33** contract).
