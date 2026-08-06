import type { SourcePos } from "./ast.js";

export class ParseError extends Error {
  readonly pos: SourcePos;
  readonly fileName: string;
  readonly code: string;

  constructor(
    message: string,
    pos: SourcePos,
    options?: { fileName?: string; code?: string }
  ) {
    super(message);
    this.name = "ParseError";
    this.pos = pos;
    this.fileName = options?.fileName ?? "<stdin>";
    this.code = options?.code ?? "parse_error";
  }

  override toString(): string {
    return `${this.fileName}:${this.pos.line}:${this.pos.column}: ${this.message}`;
  }
}
