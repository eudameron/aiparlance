import type {
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
  Span,
  TopLevelBlock,
  TypeExpr,
  ValidationBlock,
  ValidationRule,
} from "./ast.js";
import { ParseError } from "./errors.js";
import { tokenize, type Token } from "./lexer.js";

const PRIMITIVES = new Set<string>([
  "string",
  "text",
  "int",
  "float",
  "bool",
  "datetime",
  "date",
  "uuid",
  "email",
  "phone",
  "json",
]);

const UNSUPPORTED = new Map<string, string>([
  ["index", "Infra"],
  ["api", "Infra"],
  ["seed", "Infra"],
  ["policy", "Security"],
  ["workflow", "Behavior"],
  ["event", "Behavior"],
  ["lifecycle", "Behavior"],
  ["job", "Behavior"],
  ["queue", "Behavior"],
  ["ai_context", "Behavior"],
]);

export function parseSource(source: string, fileName = "<stdin>"): AipDocument {
  const tokens = tokenize(source, fileName);
  const p = new Parser(tokens, fileName);
  return p.parseProgram();
}

class Parser {
  private i = 0;

  constructor(
    private readonly tokens: Token[],
    private readonly fileName: string
  ) {}

  parseProgram(): AipDocument {
    const app = this.parseApp();
    const blocks: TopLevelBlock[] = [];
    while (!this.check("eof")) {
      blocks.push(this.parseBlock());
    }
    return { kind: "Document", fileName: this.fileName, app, blocks };
  }

  private parseApp(): AppBlock {
    const start = this.expectIdent("app").start;
    const name = this.expect("ident").value;
    let version: string | null = null;
    if (this.match("at")) {
      const major = this.expect("number").value;
      this.expect("dot");
      const minor = this.expect("number").value;
      version = `${major}.${minor}`;
    }
    this.expect("lbrace");
    const members: AppMember[] = [];
    while (!this.check("rbrace") && !this.check("eof")) {
      members.push(this.parseAppMember());
    }
    const endTok = this.expect("rbrace");
    return {
      kind: "App",
      name,
      version,
      members,
      span: span(start, endTok.end),
    };
  }

  private parseAppMember(): AppMember {
    const key = this.expect("ident");
    if (key.value === "database") {
      const engine = this.expect("ident").value;
      if (engine !== "postgres" && engine !== "mysql") {
        throw this.err(
          `invalid database engine '${engine}' (expected postgres|mysql)`,
          key.start,
          "invalid_database"
        );
      }
      return { kind: "database", engine };
    }
    if (key.value === "auth") {
      const strategy = this.expect("ident").value;
      if (
        strategy !== "jwt" &&
        strategy !== "session" &&
        strategy !== "api_key" &&
        strategy !== "oauth"
      ) {
        throw this.err(
          `invalid auth strategy '${strategy}'`,
          key.start,
          "invalid_auth"
        );
      }
      return { kind: "auth", strategy };
    }
    throw this.err(
      `unexpected app member '${key.value}'`,
      key.start,
      "invalid_app_member"
    );
  }

  private parseBlock(): TopLevelBlock {
    const tok = this.expect("ident");
    if (tok.value === "entity") return this.parseEntity(tok);
    if (tok.value === "crud") return this.parseCrud(tok);
    if (tok.value === "validation") return this.parseValidation(tok);

    const tier = UNSUPPORTED.get(tok.value);
    if (tier) {
      throw this.err(
        `'${tok.value}' is ${tier}-tier and not parsed in M1 (Core only); see ROADMAP.md`,
        tok.start,
        "unsupported_tier"
      );
    }

    throw this.err(
      `unexpected top-level '${tok.value}' (expected entity|crud|validation)`,
      tok.start,
      "unexpected_block"
    );
  }

  private parseEntity(kw: Token): EntityBlock {
    const name = this.expect("ident").value;
    this.expect("lbrace");
    const body: Array<FieldDecl | EntityModifier> = [];
    while (!this.check("rbrace") && !this.check("eof")) {
      const ident = this.expect("ident");
      if (ident.value === "timestamps" || ident.value === "soft_delete") {
        body.push({ kind: ident.value });
        continue;
      }
      this.expect("colon");
      body.push(this.parseFieldDecl(ident));
    }
    const endTok = this.expect("rbrace");
    return {
      kind: "Entity",
      name,
      body,
      span: span(kw.start, endTok.end),
    };
  }

  private parseFieldDecl(nameTok: Token): FieldDecl {
    const type = this.parseTypeExpr();
    const modifiers: FieldModifier[] = [];
    while (this.isFieldModifierStart()) {
      modifiers.push(this.parseFieldModifier());
    }
    return {
      kind: "Field",
      name: nameTok.value,
      type,
      modifiers,
      span: span(nameTok.start, this.prev().end),
    };
  }

  private isFieldModifierStart(): boolean {
    if (!this.check("ident")) return false;
    const v = this.peek().value;
    return (
      v === "required" ||
      v === "optional" ||
      v === "unique" ||
      v === "default"
    );
  }

  private parseFieldModifier(): FieldModifier {
    const tok = this.expect("ident");
    if (tok.value === "required") return { kind: "required" };
    if (tok.value === "optional") return { kind: "optional" };
    if (tok.value === "unique") return { kind: "unique" };
    if (tok.value === "default") {
      this.expect("lparen");
      const value = this.parseValue();
      this.expect("rparen");
      return { kind: "default", value };
    }
    throw this.err(`unexpected field modifier '${tok.value}'`, tok.start);
  }

  private parseValue(): DefaultValue {
    if (this.match("string")) {
      return { kind: "string", value: this.prev().value };
    }
    if (this.match("number")) {
      return { kind: "number", value: Number(this.prev().value) };
    }
    if (this.check("ident")) {
      const id = this.expect("ident");
      if (id.value === "true") return { kind: "boolean", value: true };
      if (id.value === "false") return { kind: "boolean", value: false };
      return { kind: "ident", value: id.value };
    }
    throw this.err("expected value", this.peek().start);
  }

  private parseTypeExpr(): TypeExpr {
    const tok = this.expect("ident");
    if (tok.value === "enum") {
      this.expect("lparen");
      const variants: string[] = [this.expect("ident").value];
      while (this.match("comma")) {
        variants.push(this.expect("ident").value);
      }
      this.expect("rparen");
      return { kind: "Enum", variants };
    }
    if (tok.value === "belongs_to") {
      const entity = this.expect("ident").value;
      let optional = false;
      if (this.check("ident") && this.peek().value === "optional") {
        this.advance();
        optional = true;
      }
      return { kind: "BelongsTo", entity, optional };
    }
    if (PRIMITIVES.has(tok.value)) {
      return { kind: "Primitive", name: tok.value as PrimitiveType };
    }
    return { kind: "EntityRef", name: tok.value };
  }

  private parseCrud(kw: Token): CrudStmt {
    const entity = this.expect("ident");
    return {
      kind: "Crud",
      entity: entity.value,
      span: span(kw.start, entity.end),
    };
  }

  private parseValidation(kw: Token): ValidationBlock {
    const entity = this.expect("ident").value;
    this.expect("lbrace");
    const rules: ValidationRule[] = [];
    while (!this.check("rbrace") && !this.check("eof")) {
      const field = this.expect("ident").value;
      const modifiers: Array<"required" | "unique"> = [];
      while (
        this.check("ident") &&
        (this.peek().value === "required" || this.peek().value === "unique")
      ) {
        const m = this.expect("ident").value as "required" | "unique";
        modifiers.push(m);
      }
      if (modifiers.length === 0) {
        throw this.err(
          "validation rule needs required and/or unique",
          this.peek().start
        );
      }
      rules.push({ field, modifiers });
    }
    const endTok = this.expect("rbrace");
    return {
      kind: "Validation",
      entity,
      rules,
      span: span(kw.start, endTok.end),
    };
  }

  private peek(): Token {
    return this.tokens[this.i]!;
  }

  private prev(): Token {
    return this.tokens[this.i - 1]!;
  }

  private check(kind: Token["kind"]): boolean {
    return this.peek().kind === kind;
  }

  private advance(): Token {
    const t = this.peek();
    if (t.kind !== "eof") this.i += 1;
    return t;
  }

  private match(kind: Token["kind"]): boolean {
    if (!this.check(kind)) return false;
    this.advance();
    return true;
  }

  private expect(kind: Token["kind"]): Token {
    const t = this.peek();
    if (t.kind !== kind) {
      throw this.err(`expected ${kind}, got ${t.kind}`, t.start);
    }
    return this.advance();
  }

  private expectIdent(value: string): Token {
    const t = this.expect("ident");
    if (t.value !== value) {
      throw this.err(`expected '${value}', got '${t.value}'`, t.start);
    }
    return t;
  }

  private err(message: string, pos: Token["start"], code?: string): ParseError {
    return new ParseError(message, pos, { fileName: this.fileName, code });
  }
}

function span(start: Token["start"], end: Token["end"]): Span {
  return { start, end };
}
