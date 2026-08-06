import { describe, expect, it } from "vitest";
import { emitOpenApi } from "./index.js";

describe("@aiparlance/openapi", () => {
  it("throws until M4", () => {
    expect(() => emitOpenApi({ kind: "Document", version: "0.1" })).toThrow(
      /OpenAPI emitter not implemented/
    );
  });
});
