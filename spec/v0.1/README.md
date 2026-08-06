# AI Parlance v0.1

Normative artifacts for version **0.1** (draft until a reference toolchain ships).

## Files

| File | Description |
|---|---|
| [grammar.ebnf](grammar.ebnf) | **Normative** machine-oriented grammar (Core, Infra, Security beta, Behavior beta) |

Human-readable specification: [docs.aiparlance.org](https://docs.aiparlance.org/en/specification) (EN) · [PT](https://docs.aiparlance.org/pt/specification).

## Stability

| Level | Blocks |
|---|---|
| Core | `app`, `entity`, `crud`, inline validation and `validation` block; inline `enum(…)`; inline `belongs_to` |
| Infra | `index`, `api`, `seed`, migrations/naming (semantic); entity modifiers `timestamps`, `soft_delete` |
| Security (beta) | `auth` (on `app`), `policy`, predicates |
| Behavior (beta) | `workflow`, `event`, `lifecycle`, `job`, `queue`, `ai_context`; workflow statements (`emit`, `create`, …) |

Proposed (`permission` decl, `endpoint`) and roadmap relations stay **comments only** in the grammar — see Specification.

## Examples

| File | Role |
|---|---|
| [examples/minimal.aip](../../examples/minimal.aip) | Smallest valid Core spec |
| [examples/crm-reference.aip](../../examples/crm-reference.aip) | CRM reference (policy, API, workflow) |
| [examples/ops-reference.aip](../../examples/ops-reference.aip) | Infra + Behavior extras (`seed`, `lifecycle`, `job`, …) |
