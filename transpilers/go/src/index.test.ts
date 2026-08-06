import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { parse } from "@aiparlance/parser";
import { validate } from "@aiparlance/validator";
import { emitGo, EmitGoError } from "./index.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const minimalAip = join(root, "examples/minimal.aip");
const minimalGo = join(
  dirname(fileURLToPath(import.meta.url)),
  "../fixtures/minimal.go"
);

describe("@aiparlance/go", () => {
  it("matches golden fixture for examples/minimal.aip", () => {
    const source = readFileSync(minimalAip, "utf8");
    const doc = parse(source, "examples/minimal.aip");
    expect(validate(doc).ok).toBe(true);
    expect(emitGo(doc)).toBe(readFileSync(minimalGo, "utf8"));
  });

  it("emits JWT middleware, enums, belongs_to, and soft_delete", () => {
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
  title: string required
  status: enum(new, won) required
  seller: belongs_to User optional
  soft_delete
}

crud Lead
`,
      "shop.aip"
    );
    expect(validate(doc).ok).toBe(true);
    const go = emitGo(doc);
    expect(go).toContain("package shop");
    expect(go).toContain("type LeadStatus string");
    expect(go).toContain('LeadStatusNew LeadStatus = "new"');
    expect(go).toContain("SellerID");
    expect(go).toContain("*string");
    expect(go).toContain("DeletedAt");
    expect(go).toContain("func AuthMiddleware");
    expect(go).toContain("Bearer ");
    expect(go).toContain("func ListLead");
    expect(go).toContain('LeadCollection = "/leads"');
  });

  it("throws when no entities", () => {
    const doc = parse("app Demo @0.1 { database postgres }\n", "t.aip");
    expect(() => emitGo(doc)).toThrow(EmitGoError);
  });
});
