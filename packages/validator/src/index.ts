/**
 * @aiparlance/validator — semantic validation (Phase C / M2).
 * Rules: docs Specification § Validation (Core subset).
 */

import type { AipDocument } from "@aiparlance/parser";
import { validateDocument } from "./validate.js";

export type DiagnosticSeverity = "error" | "warning";

export type Diagnostic = {
  severity: DiagnosticSeverity;
  code: string;
  message: string;
  line?: number;
  column?: number;
};

export type ValidateResult = {
  ok: boolean;
  diagnostics: Diagnostic[];
};

export { implicitEntityFields } from "./validate.js";

/**
 * Semantic validation of a parsed document.
 * Returns diagnostics; `ok` is false when any error-severity item exists.
 */
export function validate(doc: AipDocument): ValidateResult {
  return validateDocument(doc);
}

/** Human-readable diagnostic line (file prefix optional). */
export function formatDiagnostic(
  diagnostic: Diagnostic,
  fileName?: string
): string {
  const loc =
    diagnostic.line !== undefined && diagnostic.column !== undefined
      ? `${diagnostic.line}:${diagnostic.column}`
      : "?";
  const prefix = fileName ? `${fileName}:${loc}` : loc;
  return `${prefix}: [${diagnostic.severity}] ${diagnostic.code}: ${diagnostic.message}`;
}
