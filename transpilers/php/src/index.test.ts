import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { parse } from "@aiparlance/parser";
import { validate } from "@aiparlance/validator";
import { emitPhp, EmitPhpError } from "./index.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const minimalAip = join(root, "examples/minimal.aip");
const minimalPhp = join(
  dirname(fileURLToPath(import.meta.url)),
  "../fixtures/minimal.php"
);

describe("@aiparlance/php", () => {
  it("matches golden fixture for examples/minimal.aip", () => {
    const source = readFileSync(minimalAip, "utf8");
    const doc = parse(source, "examples/minimal.aip");
    expect(validate(doc).ok).toBe(true);
    expect(emitPhp(doc)).toBe(readFileSync(minimalPhp, "utf8"));
  });

  it("emits nullable props for optional and update fields", () => {
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
  seller: belongs_to User optional
}
`,
      "shop.aip"
    );
    expect(validate(doc).ok).toBe(true);
    const php = emitPhp(doc);
    expect(php).toContain("public ?string $seller_id;");
    expect(php).toContain("class LeadUpdate");
    expect(php).toContain("public ?string $title;");
  });

  it("throws when no entities", () => {
    const doc = parse("app Demo @0.1 { database postgres }\n", "t.aip");
    expect(() => emitPhp(doc)).toThrow(EmitPhpError);
  });
});
