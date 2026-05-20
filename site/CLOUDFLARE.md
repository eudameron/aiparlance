# Cloudflare — site estático (Astro)

Este site é **HTML estático**. Não use `npx wrangler deploy` no painel.

## Configuração correta (Workers & Pages → aiparlance → Configurações → Build)

| Campo | Valor |
|-------|--------|
| Tipo | **Pages** (site estático), não Worker puro |
| **Diretório raiz** | `site` |
| **Comando da build** | `npm ci && npm run build:prod` |
| **Comando de implantação** | *(vazio)* |
| **Diretório de saída** | `dist` |
| **Branch** | `main` |
| **NODE_VERSION** | `20` |

### Não usar

- `npx wrangler deploy` — gera `@astrojs/cloudflare`, `_worker.js` e o erro *Uploading a Pages _worker.js directory as an asset*
- `npm run build` — usa `astro.config.mjs` com base MAMP (`/dev/aiparlance.org/...`)
- Diretório raiz `site/dist` — não existe no Git

## Erro que você viu

```
Executing user deploy command: npx wrangler deploy
...
dist/dev/aiparlance.org/v1/site/dist/_astro/...   ← base MAMP errada
...
Uploading a Pages _worker.js directory as an asset
```

**Causa:** Wrangler + `npm run build` (local).  
**Correção:** só `npm run build:prod`, sem comando de implantação.

## Fluxo certo

```txt
git push main
  → Cloudflare entra em /site
  → npm ci && npm run build:prod  (astro.config-sample.mjs, base /)
  → publica /site/dist (en/, pt/, _astro/, sitemap.xml)
```

## Domínio

**Domínios** → `aiparlance.org` → DNS conforme o assistente.

## Teste local (produção)

```bash
cd site
npm ci
npm run build:prod
npm run preview:prod
```
