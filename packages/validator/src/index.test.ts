import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { parse } from "@aiparlance/parser";
import { formatDiagnostic, validate } from "./index.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const minimalPath = join(root, "examples/minimal.aip");

describe("@aiparlance/validator", () => {
  it("validates examples/minimal.aip", () => {
    const source = readFileSync(minimalPath, "utf8");
    const doc = parse(source, "examples/minimal.aip");
    const result = validate(doc);
    expect(result.ok).toBe(true);
    expect(result.diagnostics.filter((d) => d.severity === "error")).toHaveLength(
      0
    );
  });

  it("errors on crud for unknown entity", () => {
    const doc = parse(
      `
app Demo @0.1 { database postgres }
entity User { name: string required }
crud Order
`,
      "bad.aip"
    );
    const result = validate(doc);
    expect(result.ok).toBe(false);
    expect(result.diagnostics).toContainEqual(
      expect.objectContaining({
        code: "unknown_entity_ref",
        severity: "error",
      })
    );
  });

  it("errors on belongs_to unknown entity", () => {
    const doc = parse(
      `
app Demo @0.1 { database postgres }
entity Lead {
  seller: belongs_to User optional
}
`,
      "bad.aip"
    );
    const result = validate(doc);
    expect(result.ok).toBe(false);
    expect(result.diagnostics.some((d) => d.code === "unknown_entity_ref")).toBe(
      true
    );
  });

  it("errors on required and optional together", () => {
    const doc = parse(
      `
app Demo @0.1 { database postgres }
entity User {
  name: string required optional
}
`,
      "bad.aip"
    );
    const result = validate(doc);
    expect(result.ok).toBe(false);
    expect(result.diagnostics).toContainEqual(
      expect.objectContaining({
        code: "modifier_conflict",
        severity: "error",
      })
    );
  });

  it("errors on invalid enum default", () => {
    const doc = parse(
      `
app Demo @0.1 { database postgres }
entity User {
  role: enum(admin, seller) default(manager)
}
`,
      "bad.aip"
    );
    const result = validate(doc);
    expect(result.ok).toBe(false);
    expect(result.diagnostics).toContainEqual(
      expect.objectContaining({
        code: "invalid_enum_default",
        severity: "error",
      })
    );
  });

  it("errors on validation for unknown field", () => {
    const doc = parse(
      `
app Demo @0.1 { database postgres }
entity User { name: string }
validation User {
  email required unique
}
`,
      "bad.aip"
    );
    const result = validate(doc);
    expect(result.ok).toBe(false);
    expect(result.diagnostics).toContainEqual(
      expect.objectContaining({
        code: "unknown_field",
        severity: "error",
      })
    );
  });

  it("warns when shadowing implicit created_at", () => {
    const doc = parse(
      `
app Demo @0.1 { database postgres }
entity User {
  created_at: datetime required
}
`,
      "warn.aip"
    );
    const result = validate(doc);
    expect(result.ok).toBe(true);
    expect(result.diagnostics).toContainEqual(
      expect.objectContaining({
        code: "implicit_field_shadow",
        severity: "warning",
      })
    );
  });

  it("formatDiagnostic includes file and code", () => {
    const line = formatDiagnostic(
      {
        severity: "error",
        code: "unknown_entity_ref",
        message: "test",
        line: 3,
        column: 1,
      },
      "x.aip"
    );
    expect(line).toBe("x.aip:3:1: [error] unknown_entity_ref: test");
  });
});
