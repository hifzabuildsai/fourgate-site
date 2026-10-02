import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";

// fourgate-demo-output.txt is the stdout of `fourgate demo --pace 0`
// (fourgate 0.3.0 from PyPI, fresh venv). Exactly one edit was made: the two
// absolute local paths in the closing summary were shortened to ./fourgate-demo/...
// The check below proves every other byte is unchanged from the original run,
// and the scene split is lossless. Server-only: read at build time.

export const demoCapture = {
  command: "fourgate demo --pace 0",
  version: "0.3.0",
  date: "2026-10-02",
  platform: "Windows 11, Python 3.14.6",
};

/** SHA-256 of the original capture with the two path lines removed. */
const ORIGINAL_WITHOUT_PATHS_SHA256 = "b18decb850591e262abfb677d9d9252b8d2090c4a1e237cc38f474dfa2820747";
const REDACTED_PATH_LINES = [
  "  Outcome log:  ./fourgate-demo/demo-outcomes.jsonl",
  "  Summary page: ./fourgate-demo/fourgate-demo-summary.html",
];

export type Verdict = "PASS" | "FAIL" | "UNKNOWN";
export type Connector = "broken" | "healthy" | "outage";
export type Mode = "without" | "shadow" | "enforce";

export type DemoScene = {
  id: string;
  code: string;
  connector: Connector;
  mode: Mode;
  title: string;
  /** Lines from the capture, unedited. */
  agent: string[];
  systemOfRecord: string;
  outcomeLog: string;
  conclusion: string;
  verdict: Verdict | null;
  reason: string | null;
  output: string;
};

const sceneMeta: Pick<DemoScene, "id" | "code" | "connector" | "mode">[] = [
  { id: "s1", code: "S1", connector: "broken", mode: "without" },
  { id: "s2", code: "S2", connector: "broken", mode: "enforce" },
  { id: "s3", code: "S3", connector: "healthy", mode: "enforce" },
  { id: "s4", code: "S4", connector: "broken", mode: "shadow" },
  { id: "s5", code: "S5", connector: "outage", mode: "enforce" },
];

function checkRedaction(raw: string) {
  const lines = raw.split("\n");
  const i = lines.findIndex((l) => /^ {2}Outcome log: {2}\S/.test(l));
  if (i < 0 || lines[i] !== REDACTED_PATH_LINES[0] || lines[i + 1] !== REDACTED_PATH_LINES[1]) {
    throw new Error("Demo capture: the only allowed edit is the two shortened path lines");
  }
  const rest = [...lines.slice(0, i), ...lines.slice(i + 2)].join("\n");
  if (createHash("sha256").update(rest).digest("hex") !== ORIGINAL_WITHOUT_PATHS_SHA256) {
    throw new Error("Demo capture differs from the original run");
  }
}

function parseScene(output: string, i: number): DemoScene {
  const lines = output.split("\n");
  const header = lines[0];
  if (!header.startsWith(`[${i + 1}/5] S${i + 1} `)) throw new Error(`Scene ${i + 1} not where expected`);
  const sorIdx = lines.findIndex((l) => l.startsWith("  System of record:"));
  const logIdx = lines.findIndex((l) => l.startsWith("  Outcome log:"));
  const concl = lines.find((l) => l.startsWith("  -> "));
  if (sorIdx < 2 || logIdx < 0 || !concl) throw new Error(`Scene ${i + 1} has an unexpected shape`);
  const agent = lines.slice(2, sorIdx);
  const outcomeLog = lines[logIdx].replace(/^ {2}Outcome log:\s+/, "");
  const m = outcomeLog.match(/^(PASS|FAIL|UNKNOWN) (\S+)/);
  return {
    ...sceneMeta[i],
    title: header.replace(/^\[\d\/5\] S\d {2}/, ""),
    agent,
    systemOfRecord: lines[sorIdx].replace(/^ {2}System of record:\s+/, ""),
    outcomeLog,
    conclusion: concl.replace(/^ {2}-> /, ""),
    verdict: (m?.[1] as Verdict) ?? null,
    reason: m?.[2] ?? null,
    output,
  };
}

function load() {
  const raw = readFileSync(path.join(process.cwd(), "src/content/fourgate-demo-output.txt"), "utf8").replace(/\n$/, "");
  checkRedaction(raw);
  const blocks = raw.split(/\n\n(?=\[\d\/5\] |Summary\n)/);
  if (blocks.length !== 7) throw new Error(`Unexpected demo capture shape: ${blocks.length} blocks`);
  const [preamble, ...rest] = blocks;
  const summary = rest.pop()!;
  const scenes = rest.map(parseScene);
  if ([preamble, ...scenes.map((s) => s.output), summary].join("\n\n") !== raw) {
    throw new Error("Demo capture split is not lossless");
  }
  return { preamble, scenes, summary, raw };
}

export const demo = load();
