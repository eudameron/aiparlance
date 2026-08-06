import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { parse } from "@aiparlance/parser";
import { validate } from "@aiparlance/validator";
import { emitMysql, EmitMysqlError } from "./index.js";

const minimalMysql = `
app Demo @0.1 {
  database mysql
}

entity User {
  name: string required
  email: email required unique
}

crud User
`;

const minimalSql = join(
  dirname(fileURLToPath(import.meta.url)),
  "../fixtures/minimal.sql"
);

describe("@aiparlance/mysql", () => {
  it("matches golden fixture for mysql minimal app", () => {
    const doc = parse(minimalMysql, "minimal-mysql.aip");
    expect(validate(doc).ok).toBe(true);
    expect(emitMysql(doc)).toBe(readFileSync(minimalSql, "utf8"));
  });

  it("emits MySQL dialect for mysql app", () => {
    const doc = parse(minimalMysql, "minimal-mysql.aip");
    expect(validate(doc).ok).toBe(true);
    const sql = emitMysql(doc);
    expect(sql).toContain("CHAR(36) PRIMARY KEY DEFAULT (UUID())");
    expect(sql).toContain("DATETIME(6)");
    expect(sql).toContain("CREATE TABLE users");
    expect(sql).toContain("email TEXT UNIQUE NOT NULL");
    expect(sql).not.toContain("gen_random_uuid");
    expect(sql).not.toContain("TIMESTAMPTZ");
    expect(sql).not.toContain("pgcrypto");
  });

  it("emits CREATE INDEX and seed INSERT", () => {
    const doc = parse(
      `
app Shop @0.1 {
  database mysql
}

entity User {
  name: string required
  email: email required unique
  active: bool default(true)
}

index User {
  email
}

seed User {
  name: "Admin"
  email: "admin@example.com"
  active: true
}
`,
      "shop.aip"
    );
    expect(validate(doc).ok).toBe(true);
    const sql = emitMysql(doc);
    expect(sql).toContain("CREATE INDEX idx_users_email ON users (email);");
    expect(sql).toContain(
      `INSERT INTO users (name, email, active) VALUES ('Admin', 'admin@example.com', TRUE);`
    );
    expect(sql).toContain("DEFAULT TRUE");
  });

  it("throws for postgres suggesting emit sql", () => {
    const doc = parse(
      `app Demo @0.1 { database postgres }\nentity User { name: string required }\n`,
      "t.aip"
    );
    expect(() => emitMysql(doc)).toThrow(EmitMysqlError);
    expect(() => emitMysql(doc)).toThrow(/aip emit sql/);
  });
});
