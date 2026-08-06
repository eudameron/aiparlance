import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { parse } from "@aiparlance/parser";
import { validate } from "@aiparlance/validator";
import { emitTests, EmitTestsError } from "./index.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const minimalAip = join(root, "examples/minimal.aip");
const minimalTs = join(
  dirname(fileURLToPath(import.meta.url)),
  "../fixtures/minimal.ts"
);

describe("@aiparlance/tests", () => {
  it("matches golden fixture for examples/minimal.aip", () => {
    const source = readFileSync(minimalAip, "utf8");
    const doc = parse(source, "examples/minimal.aip");
    expect(validate(doc).ok).toBe(true);
    expect(emitTests(doc)).toBe(readFileSync(minimalTs, "utf8"));
  });

  it("lists CRUD cases with api prefix", () => {
    const doc = parse(
      `
app Shop @0.1 {
  database postgres
}

api {
  prefix "/v1"
}

entity User {
  name: string required
}

entity Lead {
  title: string required
}

crud User
crud Lead
`,
      "shop.aip"
    );
    expect(validate(doc).ok).toBe(true);
    const out = emitTests(doc);
    expect(out).toContain("userCrudCases");
    expect(out).toContain("leadCrudCases");
    expect(out).toContain('path: "/v1/users"');
    expect(out).toContain('path: "/v1/leads/{id}"');
    expect(out).toContain("method: \"DELETE\"");
  });

  it("throws when no entities", () => {
    const doc = parse("app Demo @0.1 { database postgres }\n", "t.aip");
    expect(() => emitTests(doc)).toThrow(EmitTestsError);
  });
});
