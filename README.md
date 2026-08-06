# AI Parlance

<p align="center">
  <img src="docs/logo.png" alt="AI Parlance" width="480" />
</p>

AI-first intermediate representation (IR) for AI-assisted software generation.

**Reference toolchain (Preview):** clone the repo and run `aip parse` / `validate` / `emit sql|openapi|typescript|go|mysql|…`. See [Getting started](https://docs.aiparlance.org/en/getting-started), [First emitters](https://docs.aiparlance.org/en/first-transpiler), and [CRUD walkthrough](https://docs.aiparlance.org/en/crud-walkthrough).

## Repository layout

```text
aiparlance.org/
├── docs/          Mintlify documentation (EN + PT)
├── site/          Marketing site (Astro, EN + PT)
├── spec/          Normative language specification (v0.1)
├── examples/      Reference .aip specs
├── packages/      Reference toolchain (parser, validator, CLI)
└── transpilers/   Emitters (SQL, OpenAPI, TypeScript, …)
```

## Quick links

| Path | Description |
|---|---|
| [GitHub](https://github.com/eudameron/aiparlance) | Source repository |
| [docs.aiparlance.org](https://docs.aiparlance.org) | Documentation (Mintlify); local: `cd docs && npx mintlify dev` |
| [Getting started](https://docs.aiparlance.org/en/getting-started) | Install, CLI, emit, and test |
| [First emitters](https://docs.aiparlance.org/en/first-transpiler) | PostgreSQL → OpenAPI → TypeScript story |
| [spec/v0.1/](spec/v0.1/) | Grammar and normative spec artifacts |
| [examples/minimal.aip](examples/minimal.aip) | Minimal valid v0.1 spec |
| [examples/blog-crud.aip](examples/blog-crud.aip) | Complete blog CRUD (entities, policy, API, seed) |
| [examples/inventory-crud.aip](examples/inventory-crud.aip) | Inventory CRUD + jobs/queues |
| [examples/mysql-minimal.aip](examples/mysql-minimal.aip) | MySQL dialect fixture |
| [examples/crm-reference.aip](examples/crm-reference.aip) | Full CRM reference spec |
| [examples/ops-reference.aip](examples/ops-reference.aip) | Infra + Behavior extras |
| [site/](site/) | Public marketing site ([EN](https://aiparlance.org/en) · [PT](https://aiparlance.org/pt)) |
| [transpilers/](transpilers/) | Emitters (matrix Preview packages) |
| [packages/](packages/) | Toolchain packages (`@aiparlance/*`) |
| [ROADMAP.md](ROADMAP.md) | Phase C toolchain roadmap |
| [CHANGELOG.md](CHANGELOG.md) | Project changelog |
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to contribute |

## Quick start (toolchain)

```bash
npm ci
npm test
node packages/cli/dist/cli.js validate examples/blog-crud.aip
node packages/cli/dist/cli.js emit sql examples/blog-crud.aip
node packages/cli/dist/cli.js emit openapi examples/blog-crud.aip
node packages/cli/dist/cli.js emit mysql examples/mysql-minimal.aip
```

See [ROADMAP.md](ROADMAP.md) (Phase C **M6** complete) and [CONTRIBUTING.md](CONTRIBUTING.md).

## Official site

**https://aiparlance.org/**

## Documentation

**https://docs.aiparlance.org**

- English (default) — e.g. https://docs.aiparlance.org/en/introduction  
- Portuguese — e.g. https://docs.aiparlance.org/pt/introduction  

## License

[Apache License 2.0](LICENSE).
