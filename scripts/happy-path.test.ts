import { createServer } from "node:http";
import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, describe, expect, it } from "vitest";
import { parse } from "@aiparlance/parser";
import { validate } from "@aiparlance/validator";
import { emitSql } from "@aiparlance/sql";
import { emitOpenApi } from "@aiparlance/openapi";
import { emitTypeScript } from "@aiparlance/typescript";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pkgDir = join(root, "transpilers/typescript");
const blogAip = join(root, "examples/blog-crud.aip");
const tmpApp = join(pkgDir, ".tmp-blog-app.ts");

type BlogApp = {
  createCrudApp: (opts?: {
    store?: "memory" | "pg";
    jwtSecret?: string;
    databaseUrl?: string;
  }) => ReturnType<typeof createServer>;
  signCrudToken: (
    claims: { sub: string; role?: string },
    secret?: string
  ) => Promise<string>;
  postPaths: { collection: string; item: (id: string) => string };
};

async function loadBlogApp(): Promise<BlogApp> {
  const source = readFileSync(blogAip, "utf8");
  const doc = parse(source, "examples/blog-crud.aip");
  expect(validate(doc).ok).toBe(true);
  writeFileSync(tmpApp, emitTypeScript(doc));
  return (await import("../transpilers/typescript/.tmp-blog-app.ts")) as BlogApp;
}

function listen(server: ReturnType<typeof createServer>): Promise<number> {
  return new Promise((resolve, reject) => {
    server.listen(0, "127.0.0.1", () => {
      const addr = server.address();
      if (addr && typeof addr === "object") resolve(addr.port);
      else reject(new Error("no port"));
    });
  });
}

describe("blog-crud happy path (memory + JWT)", () => {
  afterAll(() => {
    rmSync(tmpApp, { force: true });
  });

  it("HP1–HP9 smoke: validate, sql+openapi align, CRUD+policy via JWT", async () => {
    const source = readFileSync(blogAip, "utf8");
    const doc = parse(source, "examples/blog-crud.aip");
    expect(validate(doc).ok).toBe(true); // HP1

    const sql = emitSql(doc);
    expect(sql).toContain("CREATE TABLE posts");
    expect(sql).toContain("CREATE INDEX");
    expect(sql).toContain("INSERT INTO authors"); // HP2 artifact

    const openapi = JSON.parse(emitOpenApi(doc));
    expect(openapi.paths["/v1/posts"]).toBeDefined();
    expect(openapi.paths["/v1/posts"].get.security).toEqual([]);
    expect(openapi.paths["/v1/posts"].post.security).toEqual([
      { bearerAuth: [] },
    ]);

    const app = await loadBlogApp();
    expect(app.postPaths.collection).toBe("/v1/posts"); // HP3/HP9 paths

    const secret = "aip-test-secret";
    const server = app.createCrudApp({ store: "memory", jwtSecret: secret });
    const port = await listen(server);
    const base = `http://127.0.0.1:${port}`;

    try {
      const publicList = await fetch(`${base}/v1/posts`);
      expect(publicList.status).toBe(200);

      const unauth = await fetch(`${base}/v1/posts`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: "Hello",
          slug: "hello",
          body: "x",
          author_id: "00000000-0000-4000-8000-000000000001",
        }),
      });
      expect(unauth.status).toBe(401); // HP6

      const writer = await app.signCrudToken(
        { sub: "00000000-0000-4000-8000-000000000001", role: "writer" },
        secret
      );
      const bad = await fetch(`${base}/v1/posts`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${writer}`,
        },
        body: JSON.stringify({ slug: "no-title" }),
      });
      expect(bad.status).toBe(400); // HP5

      const created = await fetch(`${base}/v1/posts`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${writer}`,
        },
        body: JSON.stringify({
          title: "Hello",
          slug: "hello",
          body: "world",
          author_id: "00000000-0000-4000-8000-000000000001",
        }),
      });
      expect(created.status).toBe(201); // HP4
      const post = (await created.json()) as { id: string };
      expect(post.id).toBeTruthy();

      const forbidden = await fetch(`${base}/v1/posts/${post.id}`, {
        method: "DELETE",
        headers: { authorization: `Bearer ${writer}` },
      });
      expect(forbidden.status).toBe(403); // HP7

      const admin = await app.signCrudToken(
        { sub: "00000000-0000-4000-8000-000000000099", role: "admin" },
        secret
      );
      const deleted = await fetch(`${base}/v1/posts/${post.id}`, {
        method: "DELETE",
        headers: { authorization: `Bearer ${admin}` },
      });
      expect(deleted.status).toBe(204);

      const after = await fetch(`${base}/v1/posts`);
      const rows = (await after.json()) as unknown[];
      expect(rows.find((r) => (r as { id: string }).id === post.id)).toBeUndefined(); // HP8
    } finally {
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  });
});

describe("blog-crud happy path (Postgres)", () => {
  const databaseUrl = process.env.DATABASE_URL;
  const runPg = Boolean(databaseUrl);

  it.skipIf(!runPg)(
    "applies SQL migration and serves CRUD from Postgres",
    async () => {
      const { default: pg } = await import("pg");
      const pool = new pg.Pool({ connectionString: databaseUrl });
      const source = readFileSync(blogAip, "utf8");
      const doc = parse(source, "examples/blog-crud.aip");
      const sql = emitSql(doc);
      await pool.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
      await pool.query(sql);

      const app = await loadBlogApp();
      const secret = "aip-pg-secret";
      const server = app.createCrudApp({
        store: "pg",
        databaseUrl,
        jwtSecret: secret,
      });
      const port = await listen(server);
      const base = `http://127.0.0.1:${port}`;
      try {
        const authors = await fetch(`${base}/v1/authors`);
        expect(authors.status).toBe(200);
        const list = (await authors.json()) as { email: string }[];
        expect(list.some((a) => a.email === "admin@blog.example.com")).toBe(
          true
        );

        const token = await app.signCrudToken(
          { sub: list[0] ? String((list[0] as { id?: string }).id ?? "x") : "x", role: "admin" },
          secret
        );
        const create = await fetch(`${base}/v1/posts`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: "PG Post",
            slug: "pg-post",
            body: "from postgres",
            author_id: (list[0] as { id: string }).id,
          }),
        });
        expect(create.status).toBe(201);
      } finally {
        await new Promise<void>((resolve) => server.close(() => resolve()));
        await pool.end();
      }
    }
  );
});
