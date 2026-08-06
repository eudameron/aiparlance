import type { SourcePos } from "./ast.js";
import { ParseError } from "./errors.js";

export type TokenKind =
  | "ident"
  | "number"
  | "string"
  | "at"
  | "lbrace"
  | "rbrace"
  | "lparen"
  | "rparen"
  | "colon"
  | "comma"
  | "dot"
  | "slash"
  | "arrow"
  | "eq"
  | "plus"
  | "minus"
  | "eof";

export type Token = {
  kind: TokenKind;
  value: string;
  start: SourcePos;
  end: SourcePos;
};

export function tokenize(source: string, fileName: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  let line = 1;
  let column = 1;

  const pos = (): SourcePos => ({ line, column });

  const advance = (): void => {
    if (source[i] === "\n") {
      line += 1;
      column = 1;
    } else {
      column += 1;
    }
    i += 1;
  };

  const peek = (offset = 0): string => source[i + offset] ?? "";

  while (i < source.length) {
    const c = peek();

    if (c === " " || c === "\t" || c === "\r" || c === "\n") {
      advance();
      continue;
    }

    if (c === "/" && peek(1) === "/") {
      while (i < source.length && peek() !== "\n") advance();
      continue;
    }

    const start = pos();

    if (c === "@") {
      advance();
      tokens.push({ kind: "at", value: "@", start, end: pos() });
      continue;
    }
    if (c === "{") {
      advance();
      tokens.push({ kind: "lbrace", value: "{", start, end: pos() });
      continue;
    }
    if (c === "}") {
      advance();
      tokens.push({ kind: "rbrace", value: "}", start, end: pos() });
      continue;
    }
    if (c === "(") {
      advance();
      tokens.push({ kind: "lparen", value: "(", start, end: pos() });
      continue;
    }
    if (c === ")") {
      advance();
      tokens.push({ kind: "rparen", value: ")", start, end: pos() });
      continue;
    }
    if (c === ":") {
      advance();
      tokens.push({ kind: "colon", value: ":", start, end: pos() });
      continue;
    }
    if (c === ",") {
      advance();
      tokens.push({ kind: "comma", value: ",", start, end: pos() });
      continue;
    }
    if (c === ".") {
      advance();
      tokens.push({ kind: "dot", value: ".", start, end: pos() });
      continue;
    }
    if (c === "/") {
      advance();
      tokens.push({ kind: "slash", value: "/", start, end: pos() });
      continue;
    }
    if (c === "=") {
      advance();
      tokens.push({ kind: "eq", value: "=", start, end: pos() });
      continue;
    }
    if (c === "+") {
      advance();
      tokens.push({ kind: "plus", value: "+", start, end: pos() });
      continue;
    }
    if (c === "-" && peek(1) === ">") {
      advance();
      advance();
      tokens.push({ kind: "arrow", value: "->", start, end: pos() });
      continue;
    }
    if (c === "-") {
      advance();
      tokens.push({ kind: "minus", value: "-", start, end: pos() });
      continue;
    }

    if (c === '"') {
      advance();
      let value = "";
      while (i < source.length && peek() !== '"') {
        if (peek() === "\\" && i + 1 < source.length) {
          advance();
          const esc = peek();
          advance();
          value += esc === "n" ? "\n" : esc === "t" ? "\t" : esc;
          continue;
        }
        value += peek();
        advance();
      }
      if (peek() !== '"') {
        throw new ParseError("unterminated string literal", start, {
          fileName,
          code: "unterminated_string",
        });
      }
      advance();
      tokens.push({ kind: "string", value, start, end: pos() });
      continue;
    }

    if (/[0-9]/.test(c)) {
      let value = "";
      while (/[0-9]/.test(peek())) {
        value += peek();
        advance();
      }
      tokens.push({ kind: "number", value, start, end: pos() });
      continue;
    }

    if (/[A-Za-z_]/.test(c)) {
      let value = "";
      while (/[A-Za-z0-9_]/.test(peek())) {
        value += peek();
        advance();
      }
      tokens.push({ kind: "ident", value, start, end: pos() });
      continue;
    }

    throw new ParseError(`unexpected character '${c}'`, start, {
      fileName,
      code: "unexpected_char",
    });
  }

  const end = pos();
  tokens.push({ kind: "eof", value: "", start: end, end });
  return tokens;
}
