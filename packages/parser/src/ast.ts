/** AST nodes for AI Parlance v0.1 (Core + entity Infra modifiers). */

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

export type TopLevelBlock = EntityBlock | CrudStmt | ValidationBlock;

export type AipDocument = {
  kind: "Document";
  fileName: string;
  app: AppBlock;
  blocks: TopLevelBlock[];
};
