/**
 * @aiparlance/parser — Core lexer + parser (Phase C / M1).
 * Normative grammar: ../../spec/v0.1/grammar.ebnf
 */

export type {
  AipDocument,
  AppBlock,
  AppMember,
  CrudStmt,
  DefaultValue,
  EntityBlock,
  EntityModifier,
  FieldDecl,
  FieldModifier,
  PrimitiveType,
  SourcePos,
  Span,
  TopLevelBlock,
  TypeExpr,
  ValidationBlock,
  ValidationRule,
} from "./ast.js";

export { ParseError } from "./errors.js";
export { tokenize } from "./lexer.js";
export { parseSource as parse } from "./parser.js";
