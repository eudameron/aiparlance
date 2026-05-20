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

## Página mostra "Hello world"

Isso **não vem do Astro** (não existe no repositório). É o **Worker padrão** da Cloudflare que ainda responde no domínio.

### Teste rápido

Abra diretamente:

- `https://<seu-projeto>.pages.dev/en/`
- `https://aiparlance.org/en/`

Se **`/en/`** mostrar o site AI Parlance mas **`/`** mostrar Hello world, o build está certo — só falta ajustar o Worker/rota.

### Corrigir `Cannot read properties of undefined (reading 'fetch')`

`env.ASSETS` só existe se o binding **ASSETS** estiver configurado. Sem isso, o Worker quebra.

**Opção A — Site estático sem Worker (recomendado)**

1. Apague **todo** o código do Worker no painel (editor vazio) ou remova o script.
2. Build: `npm ci && npm run build:prod` · saída: `dist` · deploy command: **vazio**.
3. O Cloudflare publica só a pasta `dist/` (como Pages estático).

**Opção B — Manter o Worker + binding ASSETS**

1. **Settings** → **Bindings** → **Add** → **Assets** (ou *Static Assets*).
2. **Binding name:** `ASSETS` (exatamente esse nome).
3. **Directory / assets path:** `dist` (relativo à raiz `site/` após o build).
4. Cole o Worker:

```js
export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  },
};
```

5. **Save** → redeploy → **Purge cache**.

**Opção C — Deploy via Wrangler (Git) — recomendado para este projeto Worker**

| Campo | Valor |
|--------|--------|
| Comando da build | `npm ci && npm run deploy:cloudflare` |
| Comando de implantação | *(vazio)* |

Ou só implantação: `npm ci && npm run build:prod && npx wrangler deploy`

O `site/wrangler.jsonc` publica **somente `dist/`** (sem script Worker → evita erro **1101** e `ASSETS` undefined).

**Apague** qualquer código no editor do Worker no painel (Hello world ou `env.ASSETS.fetch`). O `wrangler deploy` substitui pelo deploy de assets.

### Erro 1101 — Worker threw exception

O domínio chama um Worker que **quebra** (ex.: `env.ASSETS` undefined). Corrija com:

1. Limpar código do Worker no painel, **ou**
2. `npm run build:prod && npx wrangler deploy` com `wrangler.jsonc` atual (sem `main` / sem `worker.js` obrigatório), **ou**
3. Migrar para projeto **Pages** (sem Worker).

### Corrigir via Git (alternativa)

O repositório inclui `site/worker.js` + `site/wrangler.jsonc` (pass-through para `dist/`).  
Faça `git push` após commit. Se o deploy usar Wrangler, o Worker deixa de retornar Hello world.

**Build continua:** `npm ci && npm run build:prod` — sem `npm run build` (MAMP).

### Domínio

**Domínios** → o domínio deve apontar para este **deployment** (assets), não para um Worker antigo separado.

## Teste local (produção)

```bash
cd site
npm ci
npm run build:prod
npm run preview:prod
```
