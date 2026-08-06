import { describe, expect, it } from "vitest";
import { HELP, run } from "./cli.js";

describe("@aiparlance/cli", () => {
  it("prints help for --help", () => {
    expect(HELP).toContain("aip parse");
    expect(run(["node", "aip", "--help"])).toBe(0);
  });

  it("returns 1 for parse until M1", () => {
    expect(run(["node", "aip", "parse", "x.aip"])).toBe(1);
  });
});
