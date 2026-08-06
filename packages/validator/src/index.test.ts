import { describe, expect, it } from "vitest";
import { parse } from "@aiparlance/parser";
import { validate } from "./index.js";

describe("@aiparlance/validator", () => {
  it("exports validate and throws until M2", () => {
    const doc = parse("app Demo @0.1 { database postgres }\n", "t.aip");
    expect(() => validate(doc)).toThrow(/validator not implemented/);
  });
});
