# AI Parlance

<p align="center">
  <img src="docs/logo.png" alt="AI Parlance" width="480" />
</p>

AI-first intermediate representation (IR) for AI-assisted software generation.

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
| [spec/v0.1/](spec/v0.1/) | Grammar and normative spec artifacts |
| [examples/minimal.aip](examples/minimal.aip) | Minimal valid v0.1 spec |
| [examples/crm-reference.aip](examples/crm-reference.aip) | Full CRM reference spec |
| [examples/ops-reference.aip](examples/ops-reference.aip) | Infra + Behavior extras |
| [site/](site/) | Public marketing site ([EN](https://aiparlance.org/en) · [PT](https://aiparlance.org/pt)) |
| [transpilers/](transpilers/) | Emitters (SQL → OpenAPI → TypeScript) |
| [packages/](packages/) | Toolchain packages (`@aiparlance/*`) |
| [ROADMAP.md](ROADMAP.md) | Phase C toolchain roadmap |
| [CHANGELOG.md](CHANGELOG.md) | Project changelog |
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to contribute |

## Quick start (toolchain)

```bash
npm ci
npm test
node packages/cli/dist/cli.js validate examples/minimal.aip
node packages/cli/dist/cli.js emit sql examples/minimal.aip
node packages/cli/dist/cli.js emit openapi examples/minimal.aip
node packages/cli/dist/cli.js emit typescript examples/minimal.aip
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
