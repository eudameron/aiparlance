import { describe, expect, it } from "vitest";
import { validate } from "./index.js";

describe("@aiparlance/validator", () => {
  it("exports validate and throws until M2", () => {
    expect(() =>
      validate({ kind: "Document", version: "0.1" })
    ).toThrow(/validator not implemented/);
  });
});
