/**
 * @aiparlance/validator — placeholder until M2.
 * Rules: docs Specification § Validation
 */

import type { AipDocument } from "@aiparlance/parser";

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

/**
 * Semantic validation of a parsed document.
 * @throws Always, until M2 implements Core rules.
 */
export function validate(_doc: AipDocument): ValidateResult {
  throw new Error("validator not implemented (Phase C / M2)");
}
