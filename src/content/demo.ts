import { readFileSync } from "node:fs";
import path from "node:path";

// fourgate-demo-output.txt is the verbatim stdout of `fourgate demo --pace 0`
// (fourgate 0.3.0 from PyPI, fresh venv). It is split here only at scene
// boundaries; the text itself is never edited. Server-only: read at build time.

export const demoCapture = {
  command: "fourgate demo --pace 0",
  version: "0.3.0",
  date: "2026-10-02",
  platform: "Windows 11, Python 3.14.6",
};

export type Verdict = "PASS" | "FAIL" | "UNKNOWN";

export type DemoScene = {
  id: string;
  label: string;
  verdict: Verdict | null;
  caption: string;
  output: string;
};

const sceneMeta: Omit<DemoScene, "output">[] = [
  {
    id: "s1",
    label: "S1 · No Fourgate",
    verdict: null,
    caption:
      "Without Fourgate, the agent is told the issue was created. The system of record has 0 issues.",
  },
  {
    id: "s2",
    label: "S2 · Enforce",
    verdict: "FAIL",
    caption:
      "Enforce mode: the agent receives an attributed outcome_failed verdict first, with the original response kept behind it.",
  },
  {
    id: "s3",
    label: "S3 · Healthy",
    verdict: "PASS",
    caption:
      "A real success: the read-back finds the issue, the response passes through unchanged, and the log records PASS.",
  },
  {
    id: "s4",
    label: "S4 · Shadow",
    verdict: "FAIL",
    caption:
      "Shadow mode, the default: the agent receives exactly what it got without Fourgate, and the log still records FAIL.",
  },
  {
    id: "s5",
    label: "S5 · Unreachable",
    verdict: "UNKNOWN",
    caption:
      "The system of record cannot be reached: Fourgate records UNKNOWN, never PASS, and does not block the call.",
  },
];

function load() {
  const raw = readFileSync(
    path.join(process.cwd(), "src/content/fourgate-demo-output.txt"),
    "utf8",
  ).replace(/\n$/, "");
  const blocks = raw.split(/\n\n(?=\[\d\/5\] |Summary\n)/);
  if (blocks.length !== 7) {
    throw new Error(`Unexpected demo capture shape: ${blocks.length} blocks`);
  }
  const [preamble, ...rest] = blocks;
  const summary = rest.pop()!;
  const scenes: DemoScene[] = rest.map((output, i) => {
    if (!output.startsWith(`[${i + 1}/5] S${i + 1} `)) {
      throw new Error(`Scene ${i + 1} not where expected`);
    }
    return { ...sceneMeta[i], output };
  });
  // Guard: re-joining must reproduce the capture exactly.
  if ([preamble, ...scenes.map((s) => s.output), summary].join("\n\n") !== raw) {
    throw new Error("Demo capture split is not lossless");
  }
  return { preamble, scenes, summary };
}

export const demo = load();
