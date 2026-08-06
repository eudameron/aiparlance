import type { AipDocument } from "@aiparlance/parser";

/** Emit PostgreSQL DDL from a validated AST (M3). */
export function emitSql(_doc: AipDocument): string {
  throw new Error("SQL emitter not implemented (Phase C / M3)");
}
