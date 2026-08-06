import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { parse } from "@aiparlance/parser";
import { validate } from "@aiparlance/validator";
import { emitWorkers } from "./index.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const opsAip = join(root, "examples/ops-reference.aip");
const opsFixture = join(
  dirname(fileURLToPath(import.meta.url)),
  "../fixtures/ops.ts"
);

describe("@aiparlance/workers", () => {
  it("matches golden fixture for examples/ops-reference.aip", () => {
    const source = readFileSync(opsAip, "utf8");
    const doc = parse(source, "examples/ops-reference.aip");
    expect(validate(doc).ok).toBe(true);
    expect(emitWorkers(doc)).toBe(readFileSync(opsFixture, "utf8"));
  });

  it("emits job stubs and queues from ops-reference.aip", () => {
    const source = readFileSync(opsAip, "utf8");
    const doc = parse(source, "examples/ops-reference.aip");
    expect(validate(doc).ok).toBe(true);
    const out = emitWorkers(doc);
    expect(out).toContain("export const queues");
    expect(out).toContain('SendEmail: "SendEmail"');
    expect(out).toContain("export const jobs");
    expect(out).toContain("handleSendWelcomeEmail");
    expect(out).toContain("handleSendReminder");
    expect(out).toContain("retries: 3");
    expect(out).toContain("timeout: 1m");
    expect(out).toContain("export const dispatches");
    expect(out).toContain('job: "SendWelcomeEmail"');
    expect(out).toContain('after: "15m"');
  });

  it("emits comment-only module when no jobs or queues", () => {
    const doc = parse(
      `
app Demo @0.1 {
  database postgres
}

entity User {
  name: string required
}
`,
      "t.aip"
    );
    expect(validate(doc).ok).toBe(true);
    const out = emitWorkers(doc);
    expect(out).toContain("No job or queue blocks");
    expect(out).toContain("export {}");
  });
});
