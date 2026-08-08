import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { parse } from "@aiparlance/parser";
import { validate } from "@aiparlance/validator";
import { emitOpenApi } from "./index.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const minimalAip = join(root, "examples/minimal.aip");
const minimalOpenApi = join(
  dirname(fileURLToPath(import.meta.url)),
  "../fixtures/minimal.openapi.json"
);

describe("@aiparlance/openapi", () => {
  it("matches golden fixture for examples/minimal.aip", () => {
    const source = readFileSync(minimalAip, "utf8");
    const doc = parse(source, "examples/minimal.aip");
    expect(validate(doc).ok).toBe(true);
    const json = emitOpenApi(doc);
    const expected = readFileSync(minimalOpenApi, "utf8");
    expect(json).toBe(expected);
  });

  it("emits CRUD paths, schemas, and jwt security", () => {
    const doc = parse(
      `
app Shop @0.1 {
  database postgres
  auth jwt
}

entity User {
  name: string required
}

entity Lead {
  seller: belongs_to User optional
}

crud User
crud Lead
`,
      "shop.aip"
    );
    expect(validate(doc).ok).toBe(true);
    const spec = JSON.parse(emitOpenApi(doc)) as {
      paths: Record<string, unknown>;
      components: {
        schemas: Record<string, unknown>;
        securitySchemes: Record<string, unknown>;
      };
      security: unknown[];
    };
    expect(spec.paths["/users"]).toBeDefined();
    expect(spec.paths["/users/{id}"]).toBeDefined();
    expect(spec.paths["/leads"]).toBeDefined();
    expect(spec.components.schemas.User).toBeDefined();
    expect(spec.components.schemas.UserCreate).toBeDefined();
    expect(spec.components.schemas.Lead.properties).toMatchObject({
      seller_id: { type: "string", format: "uuid" },
    });
    expect(spec.components.securitySchemes.bearerAuth).toBeDefined();
    expect(spec.security).toEqual([{ bearerAuth: [] }]);
  });

  it("maps policy rules to per-operation security", () => {
    const doc = parse(
      `
app Blog @0.1 {
  database postgres
  auth jwt
}

entity Author {
  name: string required
}

entity Post {
  title: string required
  author: belongs_to Author
}

crud Post
crud Author

policy Post {
  create authenticated
  read public
  update owner_or_manager(Post.author)
  delete role(admin)
}

api {
  prefix "/v1"
}
`,
      "blog.aip"
    );
    expect(validate(doc).ok).toBe(true);
    const spec = JSON.parse(emitOpenApi(doc)) as {
      security?: unknown;
      paths: Record<
        string,
        Record<string, { security?: unknown; responses?: Record<string, unknown>; "x-aip-policy"?: string }>
      >;
    };
    expect(spec.security).toBeUndefined();
    const list = spec.paths["/v1/posts"]!.get!;
    const create = spec.paths["/v1/posts"]!.post!;
    const del = spec.paths["/v1/posts/{id}"]!.delete!;
    expect(list.security).toEqual([]);
    expect(list["x-aip-policy"]).toBe("public");
    expect(create.security).toEqual([{ bearerAuth: [] }]);
    expect(create.responses?.["401"]).toBeDefined();
    expect(del.security).toEqual([{ bearerAuth: ["role:admin"] }]);
    expect(del["x-aip-policy"]).toBe("role(admin)");
    const upd = spec.paths["/v1/posts/{id}"]!.put!;
    expect(upd.security).toEqual([
      { bearerAuth: ["role:admin", "role:editor", "owner"] },
    ]);
    expect(upd["x-aip-policy"]).toContain("owner_or_manager");
    expect(upd["x-aip-policy"]).toContain("admin|editor");
  });
});
