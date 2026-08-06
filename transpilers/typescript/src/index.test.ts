import { describe, expect, it } from "vitest";
import { parse } from "@aiparlance/parser";
import { emitTypeScript } from "./index.js";

describe("@aiparlance/typescript", () => {
  it("throws until M5", () => {
    const doc = parse("app Demo @0.1 { database postgres }\n", "t.aip");
    expect(() => emitTypeScript(doc)).toThrow(
      /TypeScript emitter not implemented/
    );
  });
});
