import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { parse, ParseError } from "./index.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const minimalPath = join(root, "examples/minimal.aip");

describe("@aiparlance/parser", () => {
  it("parses examples/minimal.aip", () => {
    const source = readFileSync(minimalPath, "utf8");
    const doc = parse(source, "examples/minimal.aip");

    expect(doc.app.name).toBe("Demo");
    expect(doc.app.version).toBe("0.1");
    expect(doc.app.members).toEqual([{ kind: "database", engine: "postgres" }]);

    const entity = doc.blocks.find((b) => b.kind === "Entity");
    expect(entity?.kind).toBe("Entity");
    if (entity?.kind !== "Entity") throw new Error("expected Entity");
    expect(entity.name).toBe("User");
    expect(entity.body).toHaveLength(2);

    const crud = doc.blocks.find((b) => b.kind === "Crud");
    expect(crud).toEqual(
      expect.objectContaining({ kind: "Crud", entity: "User" })
    );
  });

  it("parses enum, belongs_to, and default", () => {
    const doc = parse(
      `
app Shop @0.1 {
  database postgres
  auth jwt
}

entity Lead {
  status: enum(new, won) default(new)
  seller: belongs_to User optional
}

crud Lead
`,
      "inline.aip"
    );
    const entity = doc.blocks.find((b) => b.kind === "Entity");
    expect(entity?.kind).toBe("Entity");
    if (entity?.kind !== "Entity") throw new Error("expected Entity");
    const [status, seller] = entity.body;
    expect(status).toMatchObject({
      kind: "Field",
      name: "status",
      type: { kind: "Enum", variants: ["new", "won"] },
    });
    expect(seller).toMatchObject({
      kind: "Field",
      name: "seller",
      type: { kind: "BelongsTo", entity: "User", optional: true },
    });
  });

  it("parses validation block", () => {
    const doc = parse(
      `
app Demo @0.1 { database postgres }
entity User { name: string }
validation User {
  name required
  email required unique
}
crud User
`,
      "val.aip"
    );
    const v = doc.blocks.find((b) => b.kind === "Validation");
    expect(v).toMatchObject({
      kind: "Validation",
      entity: "User",
      rules: [
        { field: "name", modifiers: ["required"] },
        { field: "email", modifiers: ["required", "unique"] },
      ],
    });
  });

  it("rejects missing app", () => {
    expect(() => parse("entity User { name: string }\n", "x.aip")).toThrow(
      ParseError
    );
  });

  it("parses crm-reference and ops-reference (Infra/Security/Behavior)", () => {
    const crm = parse(
      readFileSync(join(root, "examples/crm-reference.aip"), "utf8"),
      "examples/crm-reference.aip"
    );
    expect(crm.blocks.some((b) => b.kind === "Policy")).toBe(true);
    expect(crm.blocks.some((b) => b.kind === "Index")).toBe(true);
    expect(crm.blocks.some((b) => b.kind === "Api")).toBe(true);
    expect(crm.blocks.some((b) => b.kind === "Workflow")).toBe(true);
    expect(crm.blocks.some((b) => b.kind === "Event")).toBe(true);

    const ops = parse(
      readFileSync(join(root, "examples/ops-reference.aip"), "utf8"),
      "examples/ops-reference.aip"
    );
    expect(ops.blocks.some((b) => b.kind === "Seed")).toBe(true);
    expect(ops.blocks.some((b) => b.kind === "Job")).toBe(true);
    expect(ops.blocks.some((b) => b.kind === "Queue")).toBe(true);
    expect(ops.blocks.some((b) => b.kind === "Lifecycle")).toBe(true);
    expect(ops.blocks.some((b) => b.kind === "AiContext")).toBe(true);
  });

  it("reports line/column on errors", () => {
    try {
      parse("app Demo {\n  database postgres\n", "bad.aip");
      expect.unreachable();
    } catch (e) {
      expect(e).toBeInstanceOf(ParseError);
      const err = e as ParseError;
      expect(err.pos.line).toBeGreaterThanOrEqual(1);
      expect(err.toString()).toMatch(/bad\.aip:\d+:\d+:/);
    }
  });
});
