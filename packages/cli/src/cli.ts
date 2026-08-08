#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { parse, ParseError } from "@aiparlance/parser";
import { formatDiagnostic, validate } from "@aiparlance/validator";
import { emitSql, emitSqlMigrations, EmitSqlError } from "@aiparlance/sql";
import { emitOpenApi, EmitOpenApiError } from "@aiparlance/openapi";
import {
  emitTypeScript,
  EmitTypeScriptError,
} from "@aiparlance/typescript";
import { emitGo, EmitGoError } from "@aiparlance/go";
import { emitMysql, EmitMysqlError } from "@aiparlance/mysql";
import { emitWorkers, EmitWorkersError } from "@aiparlance/workers";
import { emitPython, EmitPythonError } from "@aiparlance/python";
import { emitPhp, EmitPhpError } from "@aiparlance/php";
import { emitDocs, EmitDocsError } from "@aiparlance/docs";
import { emitTests, EmitTestsError } from "@aiparlance/tests";
import type { AipDocument } from "@aiparlance/parser";

/**
 * AI Parlance CLI — reference toolchain
 */

const EMIT_TARGETS = [
  "sql",
  "openapi",
  "typescript",
  "go",
  "mysql",
  "workers",
  "python",
  "php",
  "docs",
  "tests",
] as const;

type EmitTarget = (typeof EMIT_TARGETS)[number];

const emitters: Record<
  EmitTarget,
  (doc: AipDocument) => string
> = {
  sql: emitSql,
  openapi: emitOpenApi,
  typescript: emitTypeScript,
  go: emitGo,
  mysql: emitMysql,
  workers: emitWorkers,
  python: emitPython,
  php: emitPhp,
  docs: emitDocs,
  tests: emitTests,
};

export const HELP = `aip — AI Parlance CLI

Usage:
  aip parse <file.aip>                 Parse to AST (JSON on stdout)
  aip validate <file.aip>              Semantic validation
  aip emit sql <file.aip>              PostgreSQL DDL (up migration)
  aip emit sql --migrations <file.aip> Up + down migration bundle
  aip emit openapi <file.aip>          OpenAPI 3 JSON
  aip emit typescript <file.aip>       TypeScript types, Zod, CRUD app
  aip emit go <file.aip>               Go structs/handlers
  aip emit mysql <file.aip>            MySQL DDL
  aip emit workers <file.aip>          Job/queue worker stubs
  aip emit python <file.aip>           Python dataclasses
  aip emit php <file.aip>              PHP classes
  aip emit docs <file.aip>             Markdown API reference
  aip emit tests <file.aip>            CRUD test fixtures

Status: Preview toolchain — parse, validate, emit (${EMIT_TARGETS.join("|")}).
Roadmap: https://github.com/eudameron/aiparlance/blob/main/ROADMAP.md
`;

export function run(argv: string[]): number {
  const args = argv.slice(2);
  if (args.length === 0 || args[0] === "-h" || args[0] === "--help") {
    process.stdout.write(HELP);
    return 0;
  }

  if (args[0] === "parse") return cmdParse(args.slice(1));
  if (args[0] === "validate") return cmdValidate(args.slice(1));
  if (args[0] === "emit") return cmdEmit(args.slice(1));

  process.stderr.write(`aip: unknown command '${args[0]}'\n\n${HELP}`);
  return 1;
}

function readAipFile(
  args: string[],
  usage: string
): { file: string; source: string } | null {
  if (args.length !== 1) {
    process.stderr.write(`aip: usage: ${usage}\n`);
    return null;
  }
  const file = resolve(args[0]!);
  try {
    return { file: args[0]!, source: readFileSync(file, "utf8") };
  } catch {
    process.stderr.write(`aip: cannot read file '${args[0]}'\n`);
    return null;
  }
}

function cmdParse(args: string[]): number {
  const input = readAipFile(args, "aip parse <file.aip>");
  if (!input) return 1;
  try {
    const doc = parse(input.source, input.file);
    process.stdout.write(`${JSON.stringify(doc, null, 2)}\n`);
    return 0;
  } catch (e) {
    return handleParseError(e);
  }
}

function cmdValidate(args: string[]): number {
  const input = readAipFile(args, "aip validate <file.aip>");
  if (!input) return 1;
  try {
    const doc = parse(input.source, input.file);
    const result = validate(doc);
    for (const d of result.diagnostics) {
      process.stderr.write(`${formatDiagnostic(d, input.file)}\n`);
    }
    if (result.ok) {
      process.stdout.write("ok\n");
      return 0;
    }
    return 1;
  } catch (e) {
    return handleParseError(e);
  }
}

function cmdEmit(args: string[]): number {
  const list = EMIT_TARGETS.join("|");
  if (args.length < 1) {
    process.stderr.write(`aip: usage: aip emit <${list}> <file.aip>\n`);
    return 1;
  }
  const target = args[0]!;
  if (!EMIT_TARGETS.includes(target as EmitTarget)) {
    process.stderr.write(
      `aip: emit '${target}' is not implemented yet (see ROADMAP.md)\n`
    );
    return 1;
  }

  let rest = args.slice(1);
  let sqlMigrations = false;
  if (target === "sql" && rest[0] === "--migrations") {
    sqlMigrations = true;
    rest = rest.slice(1);
  }

  const input = readAipFile(
    rest,
    sqlMigrations
      ? `aip emit sql --migrations <file.aip>`
      : `aip emit ${target} <file.aip>`
  );
  if (!input) return 1;
  try {
    const doc = parse(input.source, input.file);
    const result = validate(doc);
    for (const d of result.diagnostics) {
      process.stderr.write(`${formatDiagnostic(d, input.file)}\n`);
    }
    if (!result.ok) return 1;
    const out =
      target === "sql" && sqlMigrations
        ? emitSqlMigrations(doc)
        : emitters[target as EmitTarget](doc);
    process.stdout.write(out);
    if (!out.endsWith("\n")) process.stdout.write("\n");
    return 0;
  } catch (e) {
    if (
      e instanceof EmitSqlError ||
      e instanceof EmitOpenApiError ||
      e instanceof EmitTypeScriptError ||
      e instanceof EmitGoError ||
      e instanceof EmitMysqlError ||
      e instanceof EmitWorkersError ||
      e instanceof EmitPythonError ||
      e instanceof EmitPhpError ||
      e instanceof EmitDocsError ||
      e instanceof EmitTestsError
    ) {
      process.stderr.write(`aip: ${e.message}\n`);
      return 1;
    }
    return handleParseError(e);
  }
}

function handleParseError(e: unknown): number {
  if (e instanceof ParseError) {
    process.stderr.write(`${e.toString()}\n`);
    return 1;
  }
  throw e;
}

const entry = process.argv[1];
if (entry && import.meta.url === pathToFileURL(entry).href) {
  process.exit(run(process.argv));
}
