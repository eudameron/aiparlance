import { describe, expect, it } from "vitest";
import { parse } from "@aiparlance/parser";
import { emitOpenApi } from "./index.js";

describe("@aiparlance/openapi", () => {
  it("throws until M4", () => {
    const doc = parse("app Demo @0.1 { database postgres }\n", "t.aip");
    expect(() => emitOpenApi(doc)).toThrow(/OpenAPI emitter not implemented/);
  });
});
