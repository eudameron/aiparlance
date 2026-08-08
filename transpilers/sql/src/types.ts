import type { DefaultValue, PrimitiveType, TypeExpr } from "@aiparlance/parser";

const PRIMITIVE_SQL: Record<PrimitiveType, string> = {
  string: "TEXT",
  text: "TEXT",
  int: "INTEGER",
  float: "DOUBLE PRECISION",
  bool: "BOOLEAN",
  datetime: "TIMESTAMPTZ",
  date: "DATE",
  uuid: "UUID",
  email: "CITEXT",
  phone: "TEXT",
  json: "JSONB",
};

export function sqlType(type: TypeExpr): string {
  switch (type.kind) {
    case "Primitive":
      return PRIMITIVE_SQL[type.name];
    case "Enum":
      return "TEXT";
    case "BelongsTo":
      return "UUID";
    case "EntityRef":
      return "UUID";
  }
}

export function formatDefault(value: DefaultValue): string {
  switch (value.kind) {
    case "string":
      return `'${value.value.replace(/'/g, "''")}'`;
    case "number":
      return String(value.value);
    case "boolean":
      return value.value ? "TRUE" : "FALSE";
    case "ident":
      return `'${value.value.replace(/'/g, "''")}'`;
  }
}
