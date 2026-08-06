import { describe, expect, it } from "vitest";
import { parse, ParseError } from "./index.js";

describe("@aiparlance/parser", () => {
  it("exports parse and throws until M1", () => {
    expect(() => parse("app Demo @0.1 { database postgres }")).toThrow(
      ParseError
    );
  });
});
