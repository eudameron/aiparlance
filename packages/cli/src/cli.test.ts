import { describe, expect, it } from "vitest";
import { HELP, run } from "./cli.js";

describe("@aiparlance/cli", () => {
  it("prints help for --help", () => {
    expect(HELP).toContain("aip parse");
    expect(run(["node", "aip", "--help"])).toBe(0);
  });

  it("returns 1 for validate until M2", () => {
    expect(run(["node", "aip", "validate", "x.aip"])).toBe(1);
  });

  it("returns 1 when parse file is missing", () => {
    expect(run(["node", "aip", "parse", "does-not-exist.aip"])).toBe(1);
  });
});
