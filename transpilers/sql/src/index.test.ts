import { describe, expect, it } from "vitest";
import { parse } from "@aiparlance/parser";
import { emitSql } from "./index.js";

describe("@aiparlance/sql", () => {
  it("throws until M3", () => {
    const doc = parse("app Demo @0.1 { database postgres }\n", "t.aip");
    expect(() => emitSql(doc)).toThrow(/SQL emitter not implemented/);
  });
});
