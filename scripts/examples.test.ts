import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { parse, ParseError } from "@aiparlance/parser";
import { formatDiagnostic, validate } from "@aiparlance/validator";
import { emitSql } from "@aiparlance/sql";
import { emitOpenApi } from "@aiparlance/openapi";
import { emitTypeScript } from "@aiparlance/typescript";
import { emitGo } from "@aiparlance/go";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const examplesDir = join(root, "examples");

/**
 * Specs the Core-tier parser must fully accept (ROADMAP M6:
 * "validate all examples that the current tier supports").
 */
const CORE_SUPPORTED = new Set(["minimal.aip"]);

/** Phase C / M6 — CI coverage for reference specs + Core emit goldens. */
describe("examples (M6 CI)", () => {
  const files = readdirSync(examplesDir)
    .filter((f) => f.endsWith(".aip"))
    .sort();

  it("finds at least one .aip example", () => {
    expect(files.length).toBeGreaterThan(0);
  });

  for (const file of files) {
    if (CORE_SUPPORTED.has(file)) {
      it(`validates examples/${file} (Core-supported)`, () => {
        const rel = `examples/${file}`;
        const source = readFileSync(join(examplesDir, file), "utf8");
        const doc = parse(source, rel);
        const result = validate(doc);
        if (!result.ok) {
          const detail = result.diagnostics
            .map((d) => formatDiagnostic(d, rel))
            .join("\n");
          expect.fail(detail);
        }
        expect(result.ok).toBe(true);
      });
      continue;
    }

    it(`keeps examples/${file} as a higher-tier reference (unsupported_tier until Infra/Security/Behavior parse)`, () => {
      const rel = `examples/${file}`;
      const source = readFileSync(join(examplesDir, file), "utf8");
      expect(source).toMatch(/\bapp\s+\w+/);
      try {
        const doc = parse(source, rel);
        // If a future milestone parses the full file, require validation.
        expect(validate(doc).ok).toBe(true);
      } catch (e) {
        expect(e).toBeInstanceOf(ParseError);
        expect((e as ParseError).code).toBe("unsupported_tier");
      }
    });
  }

  it("emits SQL / OpenAPI / TypeScript / Go goldens for minimal.aip", () => {
    const rel = "examples/minimal.aip";
    const source = readFileSync(join(examplesDir, "minimal.aip"), "utf8");
    const doc = parse(source, rel);
    expect(validate(doc).ok).toBe(true);

    expect(emitSql(doc)).toBe(
      readFileSync(join(root, "transpilers/sql/fixtures/minimal.sql"), "utf8")
    );
    expect(emitOpenApi(doc)).toBe(
      readFileSync(
        join(root, "transpilers/openapi/fixtures/minimal.openapi.json"),
        "utf8"
      )
    );
    expect(emitTypeScript(doc)).toBe(
      readFileSync(
        join(root, "transpilers/typescript/fixtures/minimal.ts"),
        "utf8"
      )
    );
    expect(emitGo(doc)).toBe(
      readFileSync(join(root, "transpilers/go/fixtures/minimal.go"), "utf8")
    );
  });
});
