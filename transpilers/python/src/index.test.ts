import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { parse } from "@aiparlance/parser";
import { validate } from "@aiparlance/validator";
import { emitPython, EmitPythonError } from "./index.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const minimalAip = join(root, "examples/minimal.aip");
const minimalPy = join(
  dirname(fileURLToPath(import.meta.url)),
  "../fixtures/minimal.py"
);

describe("@aiparlance/python", () => {
  it("matches golden fixture for examples/minimal.aip", () => {
    const source = readFileSync(minimalAip, "utf8");
    const doc = parse(source, "examples/minimal.aip");
    expect(validate(doc).ok).toBe(true);
    expect(emitPython(doc)).toBe(readFileSync(minimalPy, "utf8"));
  });

  it("uses Optional and Literal for optional/enum fields", () => {
    const doc = parse(
      `
app Shop @0.1 {
  database postgres
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
`,
      "shop.aip"
    );
    expect(validate(doc).ok).toBe(true);
    const py = emitPython(doc);
    expect(py).toContain("from typing import Literal, Optional");
    expect(py).toContain('status: Literal["new", "won"]');
    expect(py).toContain("seller_id: Optional[str] = None");
    expect(py).toContain("deleted_at: Optional[str] = None");
    expect(py).toContain("class LeadUpdate:");
  });

  it("throws when no entities", () => {
    const doc = parse("app Demo @0.1 { database postgres }\n", "t.aip");
    expect(() => emitPython(doc)).toThrow(EmitPythonError);
  });
});
