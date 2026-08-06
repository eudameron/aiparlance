import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { HELP, run } from "./cli.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const minimalPath = join(root, "examples/minimal.aip");
const crmPath = join(root, "examples/crm-reference.aip");
const opsPath = join(root, "examples/ops-reference.aip");

describe("@aiparlance/cli", () => {
  it("prints help for --help", () => {
    expect(HELP).toContain("aip emit workers");
    expect(run(["node", "aip", "--help"])).toBe(0);
  });

  it("returns 1 when parse file is missing", () => {
    expect(run(["node", "aip", "parse", "does-not-exist.aip"])).toBe(1);
  });

  it("returns 1 for unknown emit target", () => {
    expect(run(["node", "aip", "emit", "ruby", minimalPath])).toBe(1);
  });
});

describe("@aiparlance/cli validate/emit integration", () => {
  it("validates all reference examples", () => {
    expect(run(["node", "aip", "validate", minimalPath])).toBe(0);
    expect(run(["node", "aip", "validate", crmPath])).toBe(0);
    expect(run(["node", "aip", "validate", opsPath])).toBe(0);
  });

  for (const target of [
    "sql",
    "openapi",
    "typescript",
    "go",
    "python",
    "php",
    "docs",
    "tests",
  ] as const) {
    it(`emits ${target} for minimal.aip`, () => {
      expect(run(["node", "aip", "emit", target, minimalPath])).toBe(0);
    });
  }

  it("emits workers for ops-reference.aip", () => {
    expect(run(["node", "aip", "emit", "workers", opsPath])).toBe(0);
  });
});
