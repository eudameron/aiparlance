import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { HELP, run } from "./cli.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const minimalPath = join(root, "examples/minimal.aip");

describe("@aiparlance/cli", () => {
  it("prints help for --help", () => {
    expect(HELP).toContain("aip emit sql");
    expect(run(["node", "aip", "--help"])).toBe(0);
  });

  it("returns 1 when parse file is missing", () => {
    expect(run(["node", "aip", "parse", "does-not-exist.aip"])).toBe(1);
  });

  it("returns 1 for emit openapi until M4", () => {
    expect(run(["node", "aip", "emit", "openapi", minimalPath])).toBe(1);
  });
});

describe("@aiparlance/cli validate/emit integration", () => {
  it("validates minimal.aip", () => {
    expect(run(["node", "aip", "validate", minimalPath])).toBe(0);
  });

  it("emits sql for minimal.aip", () => {
    expect(run(["node", "aip", "emit", "sql", minimalPath])).toBe(0);
  });
});
