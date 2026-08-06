import type { AipDocument } from "@aiparlance/parser";

/** Emit OpenAPI 3 document from a validated AST (M4). */
export function emitOpenApi(_doc: AipDocument): string {
  throw new Error("OpenAPI emitter not implemented (Phase C / M4)");
}
