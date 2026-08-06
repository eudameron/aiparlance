#!/usr/bin/env node
import { pathToFileURL } from "node:url";

/**
 * CLI entry — scaffold only (M0). Full commands land in M1–M6.
 */

export const HELP = `aip — AI Parlance CLI (scaffold)

Usage:
  aip parse <file.aip>              Parse to AST (M1)
  aip validate <file.aip>           Semantic validation (M2)
  aip emit <sql|openapi|typescript> <file.aip>   Emit artifacts (M3–M5)

Status: Phase C / M0 — commands are not implemented yet.
Roadmap: https://github.com/eudameron/aiparlance/blob/main/ROADMAP.md
`;

export function run(argv: string[]): number {
  const args = argv.slice(2);
  if (args.length === 0 || args[0] === "-h" || args[0] === "--help") {
    process.stdout.write(HELP);
    return 0;
  }
  if (args[0] === "parse" || args[0] === "validate" || args[0] === "emit") {
    process.stderr.write(
      `aip: '${args[0]}' is not implemented yet (see ROADMAP.md milestones M1–M5)\n`
    );
    return 1;
  }
  process.stderr.write(`aip: unknown command '${args[0]}'\n\n${HELP}`);
  return 1;
}

const entry = process.argv[1];
if (entry && import.meta.url === pathToFileURL(entry).href) {
  process.exit(run(process.argv));
}
