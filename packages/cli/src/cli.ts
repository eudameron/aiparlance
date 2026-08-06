#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { parse, ParseError } from "@aiparlance/parser";

/**
 * AI Parlance CLI — Phase C
 */

export const HELP = `aip — AI Parlance CLI

Usage:
  aip parse <file.aip>              Parse to AST (JSON on stdout)
  aip validate <file.aip>           Semantic validation (M2)
  aip emit <sql|openapi|typescript> <file.aip>   Emit artifacts (M3–M5)

Status: Phase C / M1 — parse implemented; validate/emit pending.
Roadmap: https://github.com/eudameron/aiparlance/blob/main/ROADMAP.md
`;

export function run(argv: string[]): number {
  const args = argv.slice(2);
  if (args.length === 0 || args[0] === "-h" || args[0] === "--help") {
    process.stdout.write(HELP);
    return 0;
  }

  if (args[0] === "parse") {
    return cmdParse(args.slice(1));
  }

  if (args[0] === "validate" || args[0] === "emit") {
    process.stderr.write(
      `aip: '${args[0]}' is not implemented yet (see ROADMAP.md milestones M2–M5)\n`
    );
    return 1;
  }

  process.stderr.write(`aip: unknown command '${args[0]}'\n\n${HELP}`);
  return 1;
}

function cmdParse(args: string[]): number {
  if (args.length !== 1) {
    process.stderr.write("aip: usage: aip parse <file.aip>\n");
    return 1;
  }
  const file = resolve(args[0]!);
  let source: string;
  try {
    source = readFileSync(file, "utf8");
  } catch {
    process.stderr.write(`aip: cannot read file '${args[0]}'\n`);
    return 1;
  }
  try {
    const doc = parse(source, args[0]!);
    process.stdout.write(`${JSON.stringify(doc, null, 2)}\n`);
    return 0;
  } catch (e) {
    if (e instanceof ParseError) {
      process.stderr.write(`${e.toString()}\n`);
      return 1;
    }
    throw e;
  }
}

const entry = process.argv[1];
if (entry && import.meta.url === pathToFileURL(entry).href) {
  process.exit(run(process.argv));
}
