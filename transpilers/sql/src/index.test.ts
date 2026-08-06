import { describe, expect, it } from "vitest";
import { emitSql } from "./index.js";

describe("@aiparlance/sql", () => {
  it("throws until M3", () => {
    expect(() => emitSql({ kind: "Document", version: "0.1" })).toThrow(
      /SQL emitter not implemented/
    );
  });
});
