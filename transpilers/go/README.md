# @aiparlance/go

Go structs + thin `net/http` handlers + auth middleware stubs (second application backend).

```bash
node packages/cli/dist/cli.js emit go examples/minimal.aip
```

Emits per entity:

- `Entity` / `EntityCreate` / `EntityUpdate` structs (`json` tags, snake_case)
- CRUD path constants + handler stubs (`List` / `Create` / `Get` / `Update` / `Delete`) when `crud` is declared
- `AuthMiddleware` when `app.auth` is present (`jwt` / `oauth` / `api_key` / `session`)

Stdlib only — no Gin/Chi/Echo lock-in.

Status: **Preview** · Phase D P1 (after TS/OpenAPI/SQL deepen).

See [`ROADMAP.md`](../../ROADMAP.md).
