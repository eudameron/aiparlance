import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { parse } from "@aiparlance/parser";
import { formatDiagnostic, validate } from "@aiparlance/validator";
import { emitSql } from "@aiparlance/sql";
import { emitOpenApi } from "@aiparlance/openapi";
import { emitTypeScript } from "@aiparlance/typescript";
import { emitGo } from "@aiparlance/go";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const examplesDir = join(root, "examples");

/** All examples/*.aip must parse + validate (Core/Infra/Security/Behavior). */
describe("examples (CI)", () => {
  const files = readdirSync(examplesDir)
    .filter((f) => f.endsWith(".aip"))
    .sort();

  it("finds at least one .aip example", () => {
    expect(files.length).toBeGreaterThan(0);
  });

  for (const file of files) {
    it(`validates examples/${file}`, () => {
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

  it("emits indexes and seeds from ops-reference.aip", () => {
    const rel = "examples/ops-reference.aip";
    const doc = parse(readFileSync(join(examplesDir, "ops-reference.aip"), "utf8"), rel);
    expect(validate(doc).ok).toBe(true);
    const sql = emitSql(doc);
    expect(sql).toContain("INSERT INTO users");
    expect(sql).toContain("Administrator");
  });

  it("applies api prefix in OpenAPI for crm-reference.aip", () => {
    const rel = "examples/crm-reference.aip";
    const doc = parse(readFileSync(join(examplesDir, "crm-reference.aip"), "utf8"), rel);
    expect(validate(doc).ok).toBe(true);
    const spec = JSON.parse(emitOpenApi(doc));
    expect(spec.paths["/v1/users"]).toBeDefined();
    expect(spec.paths["/v1/leads"]).toBeDefined();
  });

  it("emits full blog CRUD OpenAPI under /v1", () => {
    const rel = "examples/blog-crud.aip";
    const doc = parse(readFileSync(join(examplesDir, "blog-crud.aip"), "utf8"), rel);
    expect(validate(doc).ok).toBe(true);
    const sql = emitSql(doc);
    expect(sql).toContain("CREATE TABLE posts");
    expect(sql).toContain("INSERT INTO authors");
    expect(sql).toContain("CREATE INDEX");
    const spec = JSON.parse(emitOpenApi(doc));
    expect(spec.paths["/v1/authors"]).toBeDefined();
    expect(spec.paths["/v1/posts"]).toBeDefined();
    expect(spec.paths["/v1/comments"]).toBeDefined();
  });
});
