/**
 * @aiparlance/parser — placeholder until M1 (Core lexer + parser).
 * Normative grammar: ../../spec/v0.1/grammar.ebnf
 */

export type SourcePos = {
  line: number;
  column: number;
};

/** Opaque AST root; shape lands in M1. */
export type AipDocument = {
  readonly kind: "Document";
  readonly version: "0.1";
};

export class ParseError extends Error {
  readonly pos: SourcePos;

  constructor(message: string, pos: SourcePos) {
    super(message);
    this.name = "ParseError";
    this.pos = pos;
  }
}

/**
 * Parse `.aip` source into an AST.
 * @throws {ParseError} Always, until M1 implements Core parsing.
 */
export function parse(_source: string, _fileName = "<stdin>"): AipDocument {
  throw new ParseError("parser not implemented (Phase C / M1)", {
    line: 1,
    column: 1,
  });
}
