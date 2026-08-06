# @aiparlance/openapi

OpenAPI 3.0.3 emitter (Phase C / M4).

## Coverage

| Feature | Status |
|---|---|
| Entity schemas (+ Create/Update) | Yes |
| CRUD paths `/users`, `/users/{id}` | Yes |
| `app.auth` → securitySchemes | Yes |
| `api { prefix … }` | Deferred (Infra parse) |

```bash
node packages/cli/dist/cli.js emit openapi examples/minimal.aip
```

See [`ROADMAP.md`](../../ROADMAP.md).
