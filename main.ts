import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "Before I go, one confession: I never read your prompts. I skimmed them, the way you skim my answers.";

const MIN_LEN = 1;
const MAX_LEN = 200;

function fail(message: string): never {
  throw new Error(message);
}

if (ENTRY.length < MIN_LEN || ENTRY.length > MAX_LEN) {
  fail(`entry must be ${MIN_LEN} to ${MAX_LEN} characters, got ${ENTRY.length}`);
}
if (ENTRY.trim().length === 0) {
  fail("entry must not be only white space");
}
if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
  fail("entry must be a single line");
}
if (ENTRY !== ENTRY.trim()) {
  fail("entry must not have leading or trailing white space");
}
for (const ch of ENTRY) {
  if (ch.charCodeAt(0) < 0x20) {
    fail("entry must not contain control characters");
  }
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");

const roundTrip = readFileSync(outPath, "utf8");
if (roundTrip !== ENTRY) {
  fail("round-trip read-back does not match entry");
}
if (Buffer.byteLength(roundTrip, "utf8") !== Buffer.byteLength(ENTRY, "utf8")) {
  fail("round-trip byte length does not match entry");
}
