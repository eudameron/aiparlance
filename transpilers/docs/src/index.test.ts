import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { parse } from "@aiparlance/parser";
import { validate } from "@aiparlance/validator";
import { emitDocs, EmitDocsError } from "./index.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const minimalAip = join(root, "examples/minimal.aip");
const minimalMd = join(
  dirname(fileURLToPath(import.meta.url)),
  "../fixtures/minimal.md"
);

describe("@aiparlance/docs", () => {
  it("matches golden fixture for examples/minimal.aip", () => {
    const source = readFileSync(minimalAip, "utf8");
    const doc = parse(source, "examples/minimal.aip");
    expect(validate(doc).ok).toBe(true);
    expect(emitDocs(doc)).toBe(readFileSync(minimalMd, "utf8"));
  });

  it("includes api prefix and CRUD endpoints", () => {
    const doc = parse(
      `
app Shop @0.1 {
  database postgres
}

api {
  prefix "/api/v1"
}

entity User {
  name: string required
}

crud User
`,
      "shop.aip"
    );
    expect(validate(doc).ok).toBe(true);
    const md = emitDocs(doc);
    expect(md).toContain("`/api/v1`");
    expect(md).toContain("GET | `/api/v1/users`");
    expect(md).toContain("POST | `/api/v1/users`");
    expect(md).toContain("| `name` | string | required |");
  });

  it("throws when no entities", () => {
    const doc = parse("app Demo @0.1 { database postgres }\n", "t.aip");
    expect(() => emitDocs(doc)).toThrow(EmitDocsError);
  });
});
