# @aiparlance/openapi

OpenAPI 3.0.3 emitter. Phase C / M4 MVP; Infra follow-up added `api.prefix`. **Phase D** deepens policy → security.

## Coverage

| Feature | Status |
|---|---|
| Entity schemas (+ Create/Update) | Yes |
| CRUD paths (honors `api.prefix`) | Yes |
| `app.auth` → securitySchemes | Yes |
| `api { prefix … }` | Yes |
| `policy` → per-operation security | Phase D |

```bash
node packages/cli/dist/cli.js emit openapi examples/blog-crud.aip
```

See [`ROADMAP.md`](../../ROADMAP.md) (Phase D · P0 deepen OpenAPI) and [`EMITTER_OBJECTIVES.md`](EMITTER_OBJECTIVES.md) (**16/33** contract).
