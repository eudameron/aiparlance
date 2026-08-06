# @aiparlance/cli

Command-line interface for the reference toolchain.

## Commands

```bash
aip parse <file.aip>                 # AST JSON on stdout
aip validate <file.aip>              # diagnostics on stderr, "ok" on stdout
aip emit sql <file.aip>              # PostgreSQL DDL (M3)
aip emit openapi|typescript …        # M4–M5 — pending
```

```bash
npm run build -w @aiparlance/cli
node packages/cli/dist/cli.js emit sql examples/minimal.aip
```

See [`ROADMAP.md`](../../ROADMAP.md).
