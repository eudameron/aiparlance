import { describe, expect, it } from "vitest";
import { emitTypeScript } from "./index.js";

describe("@aiparlance/typescript", () => {
  it("throws until M5", () => {
    expect(() =>
      emitTypeScript({ kind: "Document", version: "0.1" })
    ).toThrow(/TypeScript emitter not implemented/);
  });
});
