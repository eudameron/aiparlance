/** AST nodes for AI Parlance v0.1 (Core + Infra + Security + Behavior). */

export type SourcePos = {
  line: number;
  column: number;
};

export type Span = {
  start: SourcePos;
  end: SourcePos;
};

export type PrimitiveType =
  | "string"
  | "text"
  | "int"
  | "float"
  | "bool"
  | "datetime"
  | "date"
  | "uuid"
  | "email"
  | "phone"
  | "json";

export type TypeExpr =
  | { kind: "Primitive"; name: PrimitiveType }
  | { kind: "Enum"; variants: string[] }
  | { kind: "BelongsTo"; entity: string; optional: boolean }
  | { kind: "EntityRef"; name: string };

export type FieldModifier =
  | { kind: "required" }
  | { kind: "optional" }
  | { kind: "unique" }
  | { kind: "default"; value: DefaultValue };

export type DefaultValue =
  | { kind: "string"; value: string }
  | { kind: "number"; value: number }
  | { kind: "boolean"; value: boolean }
  | { kind: "ident"; value: string };

export type FieldDecl = {
  kind: "Field";
  name: string;
  type: TypeExpr;
  modifiers: FieldModifier[];
  span: Span;
};

export type EntityModifier = { kind: "timestamps" } | { kind: "soft_delete" };

export type AppMember =
  | { kind: "database"; engine: "postgres" | "mysql" }
  | { kind: "auth"; strategy: "jwt" | "session" | "api_key" | "oauth" };

export type AppBlock = {
  kind: "App";
  name: string;
  version: string | null;
  members: AppMember[];
  span: Span;
};

export type EntityBlock = {
  kind: "Entity";
  name: string;
  body: Array<FieldDecl | EntityModifier>;
  span: Span;
};

export type CrudStmt = {
  kind: "Crud";
  entity: string;
  span: Span;
};

export type ValidationRule = {
  field: string;
  modifiers: Array<"required" | "unique">;
};

export type ValidationBlock = {
  kind: "Validation";
  entity: string;
  rules: ValidationRule[];
  span: Span;
};

/** Infra */

export type IndexBlock = {
  kind: "Index";
  entity: string;
  fields: string[];
  span: Span;
};

export type RateLimit = { count: number; unit: string };

export type ApiMember =
  | { kind: "prefix"; value: string }
  | { kind: "format"; value: string }
  | { kind: "rate_limit"; value: RateLimit }
  | { kind: "cors"; allows: string[] };

export type ApiBlock = {
  kind: "Api";
  members: ApiMember[];
  span: Span;
};

export type FieldRef = { parts: string[] };

export type Duration = { amount: number; unit: "m" | "h" | "d" };

export type Expr =
  | { kind: "string"; value: string }
  | { kind: "number"; value: number }
  | { kind: "boolean"; value: boolean }
  | { kind: "duration"; value: Duration }
  | { kind: "field_ref"; ref: FieldRef }
  | { kind: "call"; name: string; args: Expr[] }
  | { kind: "binary"; op: "+" | "-"; left: Expr; right: Expr };

export type FieldAssign = {
  name: string;
  value: Expr;
  span: Span;
};

export type SeedBlock = {
  kind: "Seed";
  entity: string;
  assigns: FieldAssign[];
  span: Span;
};

/** Security */

export type PredicateExpr =
  | { kind: "public" }
  | { kind: "authenticated" }
  | { kind: "role"; name: string }
  | { kind: "permission"; name: string }
  | { kind: "owner"; field: FieldRef }
  | { kind: "owner_or_manager"; field: FieldRef };

export type PolicyRule = {
  action: string;
  predicate: PredicateExpr;
  span: Span;
};

export type PolicyBlock = {
  kind: "Policy";
  entity: string;
  rules: PolicyRule[];
  span: Span;
};

/** Behavior */

export type LifecycleEvent = "created" | "updated" | "deleted";
export type LifecycleHook = "create" | "update" | "delete";

export type Stmt =
  | { kind: "var"; name: string; value: Expr; span: Span }
  | { kind: "if"; condition: Expr; body: Stmt[]; span: Span }
  | { kind: "assign"; target: FieldRef; value: Expr; span: Span }
  | { kind: "create"; entity: string; assigns: FieldAssign[]; span: Span }
  | { kind: "emit"; event: string; assigns: FieldAssign[]; span: Span }
  | { kind: "notify"; recipient: Expr; message: string; span: Span }
  | { kind: "reject"; message: string; span: Span }
  | { kind: "dispatch"; job: string; after: Duration | null; span: Span }
  | { kind: "expr"; value: Expr; span: Span };

export type WorkflowBlock = {
  kind: "Workflow";
  name: string;
  when: { entity: string; event: LifecycleEvent };
  body: Stmt[];
  span: Span;
};

export type LifecycleMember =
  | { kind: "on"; event: LifecycleEvent; workflow: string; span: Span }
  | { kind: "before"; hook: LifecycleHook; body: Stmt[]; span: Span }
  | { kind: "after"; hook: LifecycleHook; body: Stmt[]; span: Span };

export type LifecycleBlock = {
  kind: "Lifecycle";
  entity: string;
  members: LifecycleMember[];
  span: Span;
};

export type EventBlock = {
  kind: "Event";
  name: string;
  fields: FieldDecl[];
  span: Span;
};

export type JobBlock = {
  kind: "Job";
  name: string;
  retries: number | null;
  timeout: Duration | null;
  span: Span;
};

export type QueueBlock = {
  kind: "Queue";
  name: string;
  span: Span;
};

export type AiContextBlock = {
  kind: "AiContext";
  entity: string;
  description: string;
  span: Span;
};

export type TopLevelBlock =
  | EntityBlock
  | CrudStmt
  | ValidationBlock
  | IndexBlock
  | ApiBlock
  | SeedBlock
  | PolicyBlock
  | WorkflowBlock
  | EventBlock
  | LifecycleBlock
  | JobBlock
  | QueueBlock
  | AiContextBlock;

export type AipDocument = {
  kind: "Document";
  fileName: string;
  app: AppBlock;
  blocks: TopLevelBlock[];
};
