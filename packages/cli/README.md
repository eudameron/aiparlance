# @aiparlance/cli

Command-line interface for the reference toolchain.

## UX draft (Phase C)

```bash
aip parse <file.aip>
aip validate <file.aip>
aip emit sql <file.aip>
aip emit openapi <file.aip>
aip emit typescript <file.aip>
```

| Command | Milestone |
|---|---|
| `parse` | M1 |
| `validate` | M2 |
| `emit sql` | M3 (PostgreSQL) |
| `emit openapi` | M4 |
| `emit typescript` | M5 |

**Status:** M0 scaffold — `aip --help` works; other commands exit 1 with a clear message.

```bash
npm run build -w @aiparlance/cli
node packages/cli/dist/cli.js --help
```

See [`ROADMAP.md`](../../ROADMAP.md).
