import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { parse } from "@aiparlance/parser";
import { validate } from "@aiparlance/validator";
import { emitTypeScript, EmitTypeScriptError } from "./index.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const minimalAip = join(root, "examples/minimal.aip");
const minimalTs = join(
  dirname(fileURLToPath(import.meta.url)),
  "../fixtures/minimal.ts"
);

describe("@aiparlance/typescript", () => {
  it("matches golden fixture for examples/minimal.aip", () => {
    const source = readFileSync(minimalAip, "utf8");
    const doc = parse(source, "examples/minimal.aip");
    expect(validate(doc).ok).toBe(true);
    expect(emitTypeScript(doc)).toBe(readFileSync(minimalTs, "utf8"));
  });

  it("emitted output typechecks in isolation", () => {
    const source = readFileSync(minimalAip, "utf8");
    const doc = parse(source, "examples/minimal.aip");
    const out = emitTypeScript(doc);
    const dir = mkdtempSync(join(tmpdir(), "aip-ts-"));
    const file = join(dir, "out.ts");
    writeFileSync(file, out);
    execFileSync(
      process.execPath,
      [
        join(root, "node_modules/typescript/bin/tsc"),
        "--noEmit",
        "--strict",
        "--target",
        "ES2022",
        "--module",
        "ESNext",
        "--moduleResolution",
        "bundler",
        file,
      ],
      { stdio: "pipe" }
    );
  });

  it("emits belongs_to, soft_delete, enums, and validation blocks", () => {
    const doc = parse(
      `
app Shop @0.1 {
  database postgres
}

entity User {
  name: string required
}

entity Lead {
  title: string
  status: enum(new, won) required
  seller: belongs_to User optional
  soft_delete
}

validation Lead {
  title required
}

crud Lead
`,
      "shop.aip"
    );
    expect(validate(doc).ok).toBe(true);
    const ts = emitTypeScript(doc);
    expect(ts).toContain("export interface Lead");
    expect(ts).toContain('status: "new" | "won"');
    expect(ts).toContain("seller_id: string | null");
    expect(ts).toContain("deleted_at: string | null");
    expect(ts).toMatch(/export interface LeadCreate \{[\s\S]*title: string/);
    expect(ts).toContain("export const leadPaths");
    expect(ts).toContain('collection: "/leads"');
  });

  it("throws when no entities", () => {
    const doc = parse("app Demo @0.1 { database postgres }\n", "t.aip");
    expect(() => emitTypeScript(doc)).toThrow(EmitTypeScriptError);
  });
});
