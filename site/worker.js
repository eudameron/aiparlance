/**
 * Serves static files from dist/. Requires ASSETS binding in wrangler.jsonc
 * or Cloudflare dashboard (Settings → Bindings → Assets → name: ASSETS).
 */
export default {
  async fetch(request, env) {
    if (!env.ASSETS) {
      return new Response(
        "ASSETS binding is missing. In Cloudflare: Settings → Bindings → Assets → directory dist, binding name ASSETS. Or remove this Worker and use static Pages only (see CLOUDFLARE.md).",
        { status: 500, headers: { "content-type": "text/plain; charset=utf-8" } }
      );
    }
    return env.ASSETS.fetch(request);
  },
};
