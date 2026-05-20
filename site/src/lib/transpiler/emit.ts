import type { Field, ParsedSpec, Target } from "./types";
import { parseAip, tableName } from "./parse";

function sqlType(field: Field): string {
  if (field.relation) return "UUID";
  const map: Record<string, string> = {
    string: "TEXT",
    text: "TEXT",
    int: "INTEGER",
    float: "DOUBLE PRECISION",
    bool: "BOOLEAN",
    datetime: "TIMESTAMPTZ",
    date: "DATE",
    uuid: "UUID",
    email: "TEXT",
    phone: "TEXT",
    json: "JSONB",
  };
  const base = field.type.replace(/enum\(.*/, "TEXT");
  return map[base] ?? "TEXT";
}

function goType(field: Field): string {
  if (field.relation) return field.optional ? "*uuid.UUID" : "uuid.UUID";
  const map: Record<string, string> = {
    string: "string",
    text: "string",
    int: "int",
    float: "float64",
    bool: "bool",
    datetime: "time.Time",
    date: "time.Time",
    uuid: "uuid.UUID",
    email: "string",
    phone: "string",
    json: "json.RawMessage",
  };
  const base = field.type.startsWith("enum") ? "string" : field.type;
  const t = map[base] ?? "string";
  if (!field.required && !field.relation) return `*${t}`;
  return t;
}

function phpType(field: Field): string {
  if (field.relation) return "?string";
  const map: Record<string, string> = {
    string: "string",
    text: "string",
    int: "int",
    float: "float",
    bool: "bool",
    datetime: "\\DateTimeInterface",
    uuid: "string",
    email: "string",
    phone: "string",
    json: "array",
  };
  const base = field.type.startsWith("enum") ? "string" : field.type;
  return map[base] ?? "string";
}

function pyType(field: Field): string {
  if (field.relation) return "UUID | None";
  const map: Record<string, string> = {
    string: "str",
    text: "str",
    int: "int",
    float: "float",
    bool: "bool",
    datetime: "datetime",
    uuid: "UUID",
    email: "str",
    phone: "str",
    json: "dict",
  };
  const base = field.type.startsWith("enum") ? "str" : field.type;
  return map[base] ?? "str";
}

function emitSql(spec: ParsedSpec): string {
  const lines: string[] = [
    `-- Generated preview from AI Parlance (PostgreSQL)`,
    `-- App: ${spec.appName} · database: ${spec.database}`,
    "",
  ];

  for (const entity of spec.entities) {
    const table = tableName(entity.name);
    const cols = [
      "  id UUID PRIMARY KEY DEFAULT gen_random_uuid()",
      "  created_at TIMESTAMPTZ NOT NULL DEFAULT now()",
      "  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()",
    ];

    for (const f of entity.fields) {
      let col = `  ${f.name} ${sqlType(f)}`;
      if (f.required && !f.optional) col += " NOT NULL";
      if (f.unique) col += " UNIQUE";
      if (f.relation) col += ` REFERENCES ${tableName(f.relation)}(id)`;
      cols.push(col);
    }

    lines.push(`CREATE TABLE ${table} (`);
    lines.push(cols.join(",\n"));
    lines.push(");\n");
  }

  return lines.join("\n");
}

function emitGo(spec: ParsedSpec): string {
  const lines: string[] = [
    "// Generated preview from AI Parlance",
    `// App: ${spec.appName}`,
    "package main",
    "",
    "import (",
    '  "time"',
    "",
    '  "github.com/google/uuid"',
    ")",
    "",
  ];

  for (const entity of spec.entities) {
    lines.push(`type ${entity.name} struct {`);
    lines.push("  ID        uuid.UUID `json:\"id\"`");
    lines.push("  CreatedAt time.Time `json:\"created_at\"`");
    lines.push("  UpdatedAt time.Time `json:\"updated_at\"`");
    for (const f of entity.fields) {
      lines.push(`  ${toPascal(f.name)} ${goType(f)} \`json:"${f.name}"\``);
    }
    lines.push("}\n");
  }

  for (const name of spec.crud) {
    const route = tableName(name).replace(/_/g, "");
    lines.push(`// CRUD ${name}: POST/GET/PUT/DELETE /${route}`);
  }

  return lines.join("\n");
}

function emitPhp(spec: ParsedSpec): string {
  const lines: string[] = [
    "<?php",
    "// Generated preview from AI Parlance",
    `// App: ${spec.appName}`,
    "",
  ];

  for (const entity of spec.entities) {
    lines.push(`class ${entity.name} {`);
    lines.push("    public string $id;");
    lines.push("    public \\DateTimeInterface $created_at;");
    lines.push("    public \\DateTimeInterface $updated_at;");
    for (const f of entity.fields) {
      const nullable = f.optional || f.relation ? "?" : "";
      lines.push(`    public ${nullable}${phpType(f)} $${f.name};`);
    }
    lines.push("}\n");
  }

  return lines.join("\n");
}

function emitPython(spec: ParsedSpec): string {
  const lines: string[] = [
    "# Generated preview from AI Parlance",
    `# App: ${spec.appName}`,
    "from dataclasses import dataclass",
    "from datetime import datetime",
    "from uuid import UUID",
    "",
  ];

  for (const entity of spec.entities) {
    lines.push("@dataclass");
    lines.push(`class ${entity.name}:`);
    lines.push("    id: UUID");
    lines.push("    created_at: datetime");
    lines.push("    updated_at: datetime");
    for (const f of entity.fields) {
      const opt = f.optional || f.relation || !f.required ? " | None = None" : "";
      lines.push(`    ${f.name}: ${pyType(f)}${opt}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

function toPascal(s: string): string {
  return s
    .split("_")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
}

export function transpile(source: string, target: Target): { ok: true; code: string } | { ok: false } {
  const spec = parseAip(source);
  if (!spec) return { ok: false };

  const emitters: Record<Target, (s: ParsedSpec) => string> = {
    go: emitGo,
    php: emitPhp,
    python: emitPython,
    sql: emitSql,
  };

  return { ok: true, code: emitters[target](spec) };
}

export const defaultExample = `app Demo @0.1 {
  database postgres
  auth jwt
}

entity User {
  name: string required
  email: email required unique
  role: enum(admin, manager, seller) default(seller)
}

entity Lead {
  name: string required
  phone: phone required
  seller: belongs_to User optional
}

crud User
crud Lead`;
