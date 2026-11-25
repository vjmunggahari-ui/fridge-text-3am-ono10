// The 3AM Fridge Text — make.fun entry by @ono10
// Writes one line: the message a smart fridge sends its owner at 3am.
// Winner C06 (94 chars): "Your 3am snack has 400 calories and zero witnesses. I am the witness. I am always the witness."
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "Your 3am snack has 400 calories and zero witnesses. I am the witness. I am always the witness.";
const EXPECTED_SHA256 =
  "febf113fdc8cc32b71fa009bd1fbea016f2e5506d17bf50f8aabe81260aa1102";
const EXPECTED_LENGTH = 94;

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  throw new Error("MAKEFUN_OUTPUT_DIR is not set");
}

mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");

// Self-check: read back, verify gate (1-140 chars) and pinned sha256.
const back = readFileSync(outPath, "utf8");
if (back.includes("\n")) {
  throw new Error("entry must be a single line");
}
if (!back.endsWith(".")) {
  throw new Error("entry must end with a period");
}
if (back.length < 1 || back.length > 140) {
  throw new Error(`entry length ${back.length} outside gate 1-140`);
}
if (back.length !== EXPECTED_LENGTH) {
  throw new Error(`entry length ${back.length} != expected ${EXPECTED_LENGTH}`);
}
const sha = createHash("sha256").update(back, "utf8").digest("hex");
if (sha !== EXPECTED_SHA256) {
  throw new Error(`entry sha256 ${sha} != expected ${EXPECTED_SHA256}`);
}
console.log(`wrote ${outPath} (${back.length} chars, sha256 ${sha})`);
