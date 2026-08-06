#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { parse, ParseError } from "@aiparlance/parser";
import { formatDiagnostic, validate } from "@aiparlance/validator";
import { emitSql, EmitSqlError } from "@aiparlance/sql";
import { emitOpenApi, EmitOpenApiError } from "@aiparlance/openapi";
import {
  emitTypeScript,
  EmitTypeScriptError,
} from "@aiparlance/typescript";
import { emitGo, EmitGoError } from "@aiparlance/go";

/**
 * AI Parlance CLI — Phase C + follow-ups
 */

export const HELP = `aip — AI Parlance CLI

Usage:
  aip parse <file.aip>                 Parse to AST (JSON on stdout)
  aip validate <file.aip>              Semantic validation
  aip emit sql <file.aip>              Emit PostgreSQL DDL (M3)
  aip emit openapi <file.aip>          Emit OpenAPI 3 JSON (M4)
  aip emit typescript <file.aip>       Emit TypeScript interfaces/guards (M5)
  aip emit go <file.aip>               Emit Go structs/handlers (follow-up)

Status: Preview emitters — sql|openapi|typescript|go.
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
  if (args.length < 1) {
    process.stderr.write(
      "aip: usage: aip emit <sql|openapi|typescript|go> <file.aip>\n"
    );
    return 1;
  }
  const target = args[0]!;
  const supported = new Set(["sql", "openapi", "typescript", "go"]);
  if (!supported.has(target)) {
    process.stderr.write(
      `aip: emit '${target}' is not implemented yet (see ROADMAP.md)\n`
    );
    return 1;
  }
  const input = readAipFile(args.slice(1), `aip emit ${target} <file.aip>`);
  if (!input) return 1;
  try {
    const doc = parse(input.source, input.file);
    const result = validate(doc);
    for (const d of result.diagnostics) {
      process.stderr.write(`${formatDiagnostic(d, input.file)}\n`);
    }
    if (!result.ok) return 1;
    const out =
      target === "sql"
        ? emitSql(doc)
        : target === "openapi"
          ? emitOpenApi(doc)
          : target === "typescript"
            ? emitTypeScript(doc)
            : emitGo(doc);
    process.stdout.write(out);
    if (!out.endsWith("\n")) process.stdout.write("\n");
    return 0;
  } catch (e) {
    if (
      e instanceof EmitSqlError ||
      e instanceof EmitOpenApiError ||
      e instanceof EmitTypeScriptError ||
      e instanceof EmitGoError
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
