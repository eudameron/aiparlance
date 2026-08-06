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
});
