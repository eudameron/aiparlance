export type Target = "go" | "php" | "python" | "sql";

export interface Field {
  name: string;
  type: string;
  required: boolean;
  unique: boolean;
  optional: boolean;
  relation?: string;
}

export interface Entity {
  name: string;
  fields: Field[];
}

export interface ParsedSpec {
  appName: string;
  database: string;
  auth?: string;
  entities: Entity[];
  crud: string[];
}
