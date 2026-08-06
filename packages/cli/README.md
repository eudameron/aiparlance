# @aiparlance/cli

Command-line interface for the reference toolchain.

## Commands

```bash
aip parse <file.aip>
aip validate <file.aip>
aip emit sql <file.aip>              # PostgreSQL DDL (M3)
aip emit openapi <file.aip>          # OpenAPI 3 JSON (M4)
aip emit typescript <file.aip>       # TypeScript interfaces/guards (M5)
```

```bash
npm run build -w @aiparlance/cli
node packages/cli/dist/cli.js emit typescript examples/minimal.aip
```

See [`ROADMAP.md`](../../ROADMAP.md).
