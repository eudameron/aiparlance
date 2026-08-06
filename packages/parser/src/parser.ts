import type {
  AipDocument,
  AiContextBlock,
  ApiBlock,
  ApiMember,
  AppBlock,
  AppMember,
  CrudStmt,
  DefaultValue,
  Duration,
  EntityBlock,
  EntityModifier,
  EventBlock,
  Expr,
  FieldAssign,
  FieldDecl,
  FieldModifier,
  FieldRef,
  IndexBlock,
  JobBlock,
  LifecycleBlock,
  LifecycleEvent,
  LifecycleHook,
  LifecycleMember,
  PolicyBlock,
  PolicyRule,
  PredicateExpr,
  PrimitiveType,
  QueueBlock,
  SeedBlock,
  Span,
  Stmt,
  TopLevelBlock,
  TypeExpr,
  ValidationBlock,
  ValidationRule,
  WorkflowBlock,
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

const LIFECYCLE_EVENTS = new Set(["created", "updated", "deleted"]);
const LIFECYCLE_HOOKS = new Set(["create", "update", "delete"]);
const DURATION_UNITS = new Set(["m", "h", "d"]);

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
    switch (tok.value) {
      case "entity":
        return this.parseEntity(tok);
      case "crud":
        return this.parseCrud(tok);
      case "validation":
        return this.parseValidation(tok);
      case "index":
        return this.parseIndex(tok);
      case "api":
        return this.parseApi(tok);
      case "seed":
        return this.parseSeed(tok);
      case "policy":
        return this.parsePolicy(tok);
      case "workflow":
        return this.parseWorkflow(tok);
      case "event":
        return this.parseEvent(tok);
      case "lifecycle":
        return this.parseLifecycle(tok);
      case "job":
        return this.parseJob(tok);
      case "queue":
        return this.parseQueue(tok);
      case "ai_context":
        return this.parseAiContext(tok);
      default:
        throw this.err(
          `unexpected top-level '${tok.value}'`,
          tok.start,
          "unexpected_block"
        );
    }
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

  private parseIndex(kw: Token): IndexBlock {
    const entity = this.expect("ident").value;
    this.expect("lbrace");
    const fields: string[] = [];
    while (!this.check("rbrace") && !this.check("eof")) {
      fields.push(this.expect("ident").value);
    }
    const endTok = this.expect("rbrace");
    return {
      kind: "Index",
      entity,
      fields,
      span: span(kw.start, endTok.end),
    };
  }

  private parseApi(kw: Token): ApiBlock {
    this.expect("lbrace");
    const members: ApiMember[] = [];
    while (!this.check("rbrace") && !this.check("eof")) {
      const key = this.expect("ident");
      if (key.value === "prefix") {
        members.push({ kind: "prefix", value: this.expect("string").value });
      } else if (key.value === "format") {
        members.push({ kind: "format", value: this.expect("ident").value });
      } else if (key.value === "rate_limit") {
        const count = Number(this.expect("number").value);
        this.expect("slash");
        const unit = this.expect("ident").value;
        members.push({ kind: "rate_limit", value: { count, unit } });
      } else if (key.value === "cors") {
        this.expect("lbrace");
        const allows: string[] = [];
        while (!this.check("rbrace") && !this.check("eof")) {
          this.expectIdent("allow");
          allows.push(this.expect("string").value);
        }
        this.expect("rbrace");
        members.push({ kind: "cors", allows });
      } else {
        throw this.err(`unexpected api member '${key.value}'`, key.start);
      }
    }
    const endTok = this.expect("rbrace");
    return { kind: "Api", members, span: span(kw.start, endTok.end) };
  }

  private parseSeed(kw: Token): SeedBlock {
    const entity = this.expect("ident").value;
    this.expect("lbrace");
    const assigns = this.parseFieldAssignList();
    const endTok = this.expect("rbrace");
    return {
      kind: "Seed",
      entity,
      assigns,
      span: span(kw.start, endTok.end),
    };
  }

  private parsePolicy(kw: Token): PolicyBlock {
    const entity = this.expect("ident").value;
    this.expect("lbrace");
    const rules: PolicyRule[] = [];
    while (!this.check("rbrace") && !this.check("eof")) {
      const actionTok = this.expect("ident");
      const predicate = this.parsePredicate();
      rules.push({
        action: actionTok.value,
        predicate,
        span: span(actionTok.start, this.prev().end),
      });
    }
    const endTok = this.expect("rbrace");
    return {
      kind: "Policy",
      entity,
      rules,
      span: span(kw.start, endTok.end),
    };
  }

  private parsePredicate(): PredicateExpr {
    const tok = this.expect("ident");
    if (tok.value === "public") return { kind: "public" };
    if (tok.value === "authenticated") return { kind: "authenticated" };
    if (
      tok.value === "role" ||
      tok.value === "permission" ||
      tok.value === "owner" ||
      tok.value === "owner_or_manager"
    ) {
      this.expect("lparen");
      if (tok.value === "role" || tok.value === "permission") {
        const name = this.expect("ident").value;
        this.expect("rparen");
        return { kind: tok.value, name };
      }
      const field = this.parseFieldRef();
      this.expect("rparen");
      return { kind: tok.value, field };
    }
    throw this.err(`unknown predicate '${tok.value}'`, tok.start);
  }

  private parseWorkflow(kw: Token): WorkflowBlock {
    const name = this.expect("ident").value;
    this.expect("lbrace");
    this.expectIdent("when");
    const entity = this.expect("ident").value;
    this.expect("dot");
    const eventTok = this.expect("ident");
    if (!LIFECYCLE_EVENTS.has(eventTok.value)) {
      throw this.err(
        `invalid lifecycle event '${eventTok.value}'`,
        eventTok.start
      );
    }
    const body: Stmt[] = [];
    while (!this.check("rbrace") && !this.check("eof")) {
      body.push(this.parseStmt());
    }
    const endTok = this.expect("rbrace");
    return {
      kind: "Workflow",
      name,
      when: {
        entity,
        event: eventTok.value as LifecycleEvent,
      },
      body,
      span: span(kw.start, endTok.end),
    };
  }

  private parseEvent(kw: Token): EventBlock {
    const name = this.expect("ident").value;
    this.expect("lbrace");
    const fields: FieldDecl[] = [];
    while (!this.check("rbrace") && !this.check("eof")) {
      const ident = this.expect("ident");
      this.expect("colon");
      fields.push(this.parseFieldDecl(ident));
    }
    const endTok = this.expect("rbrace");
    return {
      kind: "Event",
      name,
      fields,
      span: span(kw.start, endTok.end),
    };
  }

  private parseLifecycle(kw: Token): LifecycleBlock {
    const entity = this.expect("ident").value;
    this.expect("lbrace");
    const members: LifecycleMember[] = [];
    while (!this.check("rbrace") && !this.check("eof")) {
      const key = this.expect("ident");
      if (key.value === "on") {
        const eventTok = this.expect("ident");
        if (!LIFECYCLE_EVENTS.has(eventTok.value)) {
          throw this.err(
            `invalid lifecycle event '${eventTok.value}'`,
            eventTok.start
          );
        }
        this.expect("arrow");
        this.expectIdent("workflow");
        const workflow = this.expect("ident").value;
        members.push({
          kind: "on",
          event: eventTok.value as LifecycleEvent,
          workflow,
          span: span(key.start, this.prev().end),
        });
      } else if (key.value === "before" || key.value === "after") {
        const hookTok = this.expect("ident");
        if (!LIFECYCLE_HOOKS.has(hookTok.value)) {
          throw this.err(`invalid lifecycle hook '${hookTok.value}'`, hookTok.start);
        }
        this.expect("lbrace");
        const body: Stmt[] = [];
        while (!this.check("rbrace") && !this.check("eof")) {
          body.push(this.parseStmt());
        }
        const end = this.expect("rbrace");
        members.push({
          kind: key.value,
          hook: hookTok.value as LifecycleHook,
          body,
          span: span(key.start, end.end),
        });
      } else {
        throw this.err(`unexpected lifecycle member '${key.value}'`, key.start);
      }
    }
    const endTok = this.expect("rbrace");
    return {
      kind: "Lifecycle",
      entity,
      members,
      span: span(kw.start, endTok.end),
    };
  }

  private parseJob(kw: Token): JobBlock {
    const name = this.expect("ident").value;
    this.expect("lbrace");
    let retries: number | null = null;
    let timeout: Duration | null = null;
    while (!this.check("rbrace") && !this.check("eof")) {
      const key = this.expect("ident");
      if (key.value === "retries") {
        retries = Number(this.expect("number").value);
      } else if (key.value === "timeout") {
        timeout = this.parseDuration();
      } else {
        throw this.err(`unexpected job member '${key.value}'`, key.start);
      }
    }
    const endTok = this.expect("rbrace");
    return {
      kind: "Job",
      name,
      retries,
      timeout,
      span: span(kw.start, endTok.end),
    };
  }

  private parseQueue(kw: Token): QueueBlock {
    const name = this.expect("ident");
    return {
      kind: "Queue",
      name: name.value,
      span: span(kw.start, name.end),
    };
  }

  private parseAiContext(kw: Token): AiContextBlock {
    const entity = this.expect("ident").value;
    this.expect("lbrace");
    this.expectIdent("description");
    const description = this.expect("string").value;
    const endTok = this.expect("rbrace");
    return {
      kind: "AiContext",
      entity,
      description,
      span: span(kw.start, endTok.end),
    };
  }

  private parseStmt(): Stmt {
    const start = this.peek();
    if (this.check("ident") && this.peek().value === "var") {
      this.advance();
      const name = this.expect("ident").value;
      this.expect("eq");
      const value = this.parseExpr();
      return {
        kind: "var",
        name,
        value,
        span: span(start.start, this.prev().end),
      };
    }
    if (this.check("ident") && this.peek().value === "if") {
      this.advance();
      const condition = this.parseExpr();
      this.expect("lbrace");
      const body: Stmt[] = [];
      while (!this.check("rbrace") && !this.check("eof")) {
        body.push(this.parseStmt());
      }
      const end = this.expect("rbrace");
      return {
        kind: "if",
        condition,
        body,
        span: span(start.start, end.end),
      };
    }
    if (this.check("ident") && this.peek().value === "assign") {
      this.advance();
      const target = this.parseFieldRef();
      const value = this.parseExpr();
      return {
        kind: "assign",
        target,
        value,
        span: span(start.start, this.prev().end),
      };
    }
    if (this.check("ident") && this.peek().value === "create") {
      this.advance();
      const entity = this.expect("ident").value;
      this.expect("lbrace");
      const assigns = this.parseFieldAssignList();
      const end = this.expect("rbrace");
      return {
        kind: "create",
        entity,
        assigns,
        span: span(start.start, end.end),
      };
    }
    if (this.check("ident") && this.peek().value === "emit") {
      this.advance();
      const event = this.expect("ident").value;
      this.expect("lbrace");
      const assigns = this.parseFieldAssignList();
      const end = this.expect("rbrace");
      return {
        kind: "emit",
        event,
        assigns,
        span: span(start.start, end.end),
      };
    }
    if (this.check("ident") && this.peek().value === "notify") {
      this.advance();
      this.expect("lparen");
      const recipient = this.parseExpr();
      this.expect("comma");
      const message = this.expect("string").value;
      this.expect("rparen");
      return {
        kind: "notify",
        recipient,
        message,
        span: span(start.start, this.prev().end),
      };
    }
    if (this.check("ident") && this.peek().value === "reject") {
      this.advance();
      const message = this.expect("string").value;
      return {
        kind: "reject",
        message,
        span: span(start.start, this.prev().end),
      };
    }
    if (this.check("ident") && this.peek().value === "dispatch") {
      this.advance();
      const job = this.expect("ident").value;
      let after: Duration | null = null;
      if (this.check("ident") && this.peek().value === "after") {
        this.advance();
        after = this.parseDuration();
      }
      return {
        kind: "dispatch",
        job,
        after,
        span: span(start.start, this.prev().end),
      };
    }
    // expr statement (call)
    const value = this.parseExpr();
    if (value.kind !== "call") {
      throw this.err(
        "expected statement (var|if|assign|create|emit|notify|reject|dispatch|call)",
        start.start
      );
    }
    return {
      kind: "expr",
      value,
      span: span(start.start, this.prev().end),
    };
  }

  private parseFieldAssignList(): FieldAssign[] {
    const assigns: FieldAssign[] = [];
    while (!this.check("rbrace") && !this.check("eof")) {
      const nameTok = this.expect("ident");
      this.expect("colon");
      const value = this.parseExpr();
      assigns.push({
        name: nameTok.value,
        value,
        span: span(nameTok.start, this.prev().end),
      });
    }
    return assigns;
  }

  private parseExpr(): Expr {
    let left = this.parsePrimary();
    while (this.check("plus") || this.check("minus")) {
      const op = this.advance().kind === "plus" ? "+" : "-";
      const right = this.parsePrimary();
      left = { kind: "binary", op, left, right };
    }
    return left;
  }

  private parsePrimary(): Expr {
    if (this.match("string")) {
      return { kind: "string", value: this.prev().value };
    }
    if (this.check("number")) {
      const num = this.expect("number");
      if (
        this.check("ident") &&
        DURATION_UNITS.has(this.peek().value)
      ) {
        const unit = this.expect("ident").value as Duration["unit"];
        return {
          kind: "duration",
          value: { amount: Number(num.value), unit },
        };
      }
      return { kind: "number", value: Number(num.value) };
    }
    if (this.match("lparen")) {
      const inner = this.parseExpr();
      this.expect("rparen");
      return inner;
    }
    if (this.check("ident")) {
      const id = this.expect("ident");
      if (id.value === "true") return { kind: "boolean", value: true };
      if (id.value === "false") return { kind: "boolean", value: false };
      if (this.match("lparen")) {
        const args: Expr[] = [];
        if (!this.check("rparen")) {
          args.push(this.parseExpr());
          while (this.match("comma")) args.push(this.parseExpr());
        }
        this.expect("rparen");
        return { kind: "call", name: id.value, args };
      }
      // field_ref starting with this ident
      const parts = [id.value];
      while (this.match("dot")) {
        parts.push(this.expect("ident").value);
      }
      return { kind: "field_ref", ref: { parts } };
    }
    throw this.err("expected expression", this.peek().start);
  }

  private parseFieldRef(): FieldRef {
    const parts = [this.expect("ident").value];
    while (this.match("dot")) {
      parts.push(this.expect("ident").value);
    }
    return { parts };
  }

  private parseDuration(): Duration {
    const amount = Number(this.expect("number").value);
    const unitTok = this.expect("ident");
    if (!DURATION_UNITS.has(unitTok.value)) {
      throw this.err(
        `invalid duration unit '${unitTok.value}' (expected m|h|d)`,
        unitTok.start
      );
    }
    return { amount, unit: unitTok.value as Duration["unit"] };
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
