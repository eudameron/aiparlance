import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { parse } from "@aiparlance/parser";
import { validate } from "@aiparlance/validator";
import { emitSql, emitSqlDown, emitSqlMigrations, EmitSqlError, fkColumnName, tableName } from "./index.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const minimalAip = join(root, "examples/minimal.aip");
const minimalSql = join(
  dirname(fileURLToPath(import.meta.url)),
  "../fixtures/minimal.sql"
);

describe("@aiparlance/sql naming", () => {
  it("maps entities to plural snake tables", () => {
    expect(tableName("User")).toBe("users");
    expect(tableName("SalesOrder")).toBe("sales_orders");
    expect(fkColumnName("seller")).toBe("seller_id");
    expect(fkColumnName("user_id")).toBe("user_id");
  });
});

describe("@aiparlance/sql emit", () => {
  it("matches golden fixture for examples/minimal.aip", () => {
    const source = readFileSync(minimalAip, "utf8");
    const doc = parse(source, "examples/minimal.aip");
    expect(validate(doc).ok).toBe(true);
    const sql = emitSql(doc);
    const expected = readFileSync(minimalSql, "utf8");
    expect(sql).toBe(expected);
  });

  it("emits belongs_to FK and enum check", () => {
    const doc = parse(
      `
app Shop @0.1 {
  database postgres
}

entity User {
  name: string required
}

entity Lead {
  soft_delete
  status: enum(new, won) default(new)
  seller: belongs_to User optional
}

crud User
crud Lead
`,
      "shop.aip"
    );
    expect(validate(doc).ok).toBe(true);
    const sql = emitSql(doc);
    expect(sql).toContain("CREATE TABLE users");
    expect(sql).toContain("CREATE TABLE leads");
    expect(sql).toContain("seller_id UUID REFERENCES users (id)");
    expect(sql).toContain("deleted_at TIMESTAMPTZ");
    expect(sql).toContain("CHECK (status IN ('new', 'won'))");
    expect(sql).toContain("DEFAULT 'new'");
    // users before leads
    expect(sql.indexOf("CREATE TABLE users")).toBeLessThan(
      sql.indexOf("CREATE TABLE leads")
    );
  });

  it("rejects mysql in M3", () => {
    const doc = parse(
      `
app Demo @0.1 { database mysql }
entity User { name: string required }
`,
      "mysql.aip"
    );
    expect(() => emitSql(doc)).toThrow(EmitSqlError);
  });

  it("emits down migration and migration bundle markers", () => {
    const source = readFileSync(minimalAip, "utf8");
    const doc = parse(source, "examples/minimal.aip");
    const down = emitSqlDown(doc);
    expect(down).toContain("DROP TABLE IF EXISTS users CASCADE");
    const bundle = emitSqlMigrations(doc);
    expect(bundle).toContain("migrations/0001_init.up.sql");
    expect(bundle).toContain("migrations/0001_init.down.sql");
    expect(bundle).toContain("CREATE TABLE");
    expect(bundle).toContain("DROP TABLE");
  });
});
