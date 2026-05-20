import type { Entity, Field, ParsedSpec } from "./types";

const ENTITY_RE = /entity\s+(\w+)\s*\{([^}]*)\}/gs;
const FIELD_RE = /(\w+)\s*:\s*([^\n]+)/g;
const APP_RE = /app\s+(\w+)/;
const DB_RE = /database\s+(\w+)/;
const AUTH_RE = /auth\s+(\w+)/;
const CRUD_RE = /^\s*crud\s+(\w+)\s*$/gm;

function parseFieldLine(line: string): Field | null {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("//")) return null;

  const m = trimmed.match(/^(\w+)\s*:\s*(.+)$/);
  if (!m) return null;

  const name = m[1];
  const rest = m[2];
  const belongs = rest.match(/belongs_to\s+(\w+)/);
  const type = belongs ? `belongs_to ${belongs[1]}` : rest.split(/\s+/)[0];

  return {
    name,
    type,
    required: /\brequired\b/.test(rest),
    optional: /\boptional\b/.test(rest),
    unique: /\bunique\b/.test(rest),
    relation: belongs?.[1],
  };
}

export function parseAip(source: string): ParsedSpec | null {
  const appMatch = source.match(APP_RE);
  if (!appMatch) return null;

  const entities: Entity[] = [];
  let match: RegExpExecArray | null;

  ENTITY_RE.lastIndex = 0;
  while ((match = ENTITY_RE.exec(source)) !== null) {
    const name = match[1];
    const body = match[2];
    const fields: Field[] = [];

    FIELD_RE.lastIndex = 0;
    let fieldMatch: RegExpExecArray | null;
    while ((fieldMatch = FIELD_RE.exec(body)) !== null) {
      const field = parseFieldLine(`${fieldMatch[1]}: ${fieldMatch[2]}`);
      if (field) fields.push(field);
    }

    entities.push({ name, fields });
  }

  if (entities.length === 0) return null;

  const crud: string[] = [];
  CRUD_RE.lastIndex = 0;
  let crudMatch: RegExpExecArray | null;
  while ((crudMatch = CRUD_RE.exec(source)) !== null) {
    crud.push(crudMatch[1]);
  }

  return {
    appName: appMatch[1],
    database: source.match(DB_RE)?.[1] ?? "postgres",
    auth: source.match(AUTH_RE)?.[1],
    entities,
    crud: crud.length ? crud : entities.map((e) => e.name),
  };
}

export function tableName(entity: string): string {
  const snake = entity.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "");
  return `${snake}s`;
}
