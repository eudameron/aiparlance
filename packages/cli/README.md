# @aiparlance/cli

Command-line interface for the reference toolchain.

## Commands

```bash
aip parse <file.aip>                 # M1 — AST JSON on stdout
aip validate <file.aip>              # M2 — pending
aip emit sql|openapi|typescript …  # M3–M5 — pending
```

```bash
npm run build -w @aiparlance/cli
node packages/cli/dist/cli.js parse examples/minimal.aip
```

See [`ROADMAP.md`](../../ROADMAP.md).
