# @aiparlance/cli

Command-line interface for the reference toolchain.

## Commands

```bash
aip parse <file.aip>                 # M1 — AST JSON on stdout
aip validate <file.aip>              # M2 — diagnostics on stderr, "ok" on stdout
aip emit sql|openapi|typescript …  # M3–M5 — pending
```

```bash
npm run build -w @aiparlance/cli
node packages/cli/dist/cli.js validate examples/minimal.aip
```

See [`ROADMAP.md`](../../ROADMAP.md).
