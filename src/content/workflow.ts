import { readFileSync } from "node:fs";
import path from "node:path";
import { demo } from "./demo";

// The six-step product flow. Every "output" is a real capture from fourgate
// 0.3.0; steps without a capture show the README's command and the README's
// own description of the result, labeled as such. Server-only.

const read = (name: string) => readFileSync(path.join(process.cwd(), "src/content", name), "utf8").replace(/\n$/, "");

export type WorkflowStep = {
  id: string;
  name: string;
  purpose: string;
  command: string;
  commandNote?: string;
  /** Exact captured output, if we have one. */
  output?: string;
  outputNote?: string;
  /** README text describing the result, when there is no captured output. */
  readme?: string;
  link?: { href: string; label: string };
};

export const workflow: WorkflowStep[] = [
  {
    id: "demo",
    name: "demo",
    purpose: "See it work: local, simulated, no keys, no network.",
    command: "fourgate demo --pace 0",
    output: demo.raw,
    outputNote: "Captured 2026-10-02. Paths shortened.",
  },
  {
    id: "init",
    name: "init",
    purpose: "Write scan, runtime and read-back configs for one write tool.",
    command: `fourgate init --tool create_issue --test-account disposable-demo   --id-path result.structuredContent.id   --readback-url 'https://api.example.com/issues/{record_id}'   --expect title=title --arg title=FOURGATE-SCAN-TEST   --token-env READBACK_TOKEN --missing-status 404   -- python your_server.py`,
    commandNote: "The example from the README. api.example.com and your_server.py are placeholders.",
    output: read("fourgate-init-output.txt"),
    outputNote: "Captured on Windows, so paths use backslashes.",
  },
  {
    id: "doctor",
    name: "doctor",
    purpose: "Check the setup without side effects.",
    command:
      "fourgate doctor --contracts fourgate-config/runtime.json --server server --log outcomes.jsonl -- python -m fourgate.demo.server",
    commandNote:
      "Run against the files init wrote, with the bundled demo server standing in for yours and READBACK_TOKEN set to a dummy value.",
    output: read("fourgate-doctor-output.txt"),
    outputNote: "Captured in C:\\fg-example on Windows.",
  },
  {
    id: "scan",
    name: "scan",
    purpose: "Contracted writes against a disposable test account.",
    command: `export FOURGATE_DEMO_STORE="$(mktemp -d)/issues.json"
export FOURGATE_DEMO_MODE=broken
fourgate scan fixtures/contracts/scan_demo.json \\
  --confirm-test-account disposable-demo --report-dir ./fourgate-output`,
    commandNote: "The README's bundled-fixture example (needs a checkout of the repository).",
    readme:
      "The expected result is FAIL / record_missing (exit 1), with local fourgate-report.json and self-contained fourgate-report.html in the chosen directory. Set FOURGATE_DEMO_MODE=healthy and rerun with a fresh store path to see PASS (exit 0). UNKNOWN is never counted as PASS (exit 1). Invalid scan configuration exits 2.",
  },
  {
    id: "guard",
    name: "guard",
    purpose: "Wrap the server at runtime: shadow first, then enforce.",
    command: `fourgate guard \\
  --contracts path/to/contracts.json \\
  --mode shadow \\
  --server my-server \\
  --log outcomes.jsonl \\
  -- python your_server.py`,
    readme:
      "Switch to --mode enforce only for human-approved contracts after shadow traffic is clean. guard validates the contracts at startup and exits 2 without starting the server if any are invalid; per-call verifier faults are still UNKNOWN and fail open. The startup summary goes to stderr, so stdout carries only MCP traffic.",
  },
  {
    id: "summary",
    name: "summary",
    purpose: "Turn outcomes.jsonl into a local HTML page.",
    command: "fourgate summary outcomes.jsonl --out fourgate-summary.html",
    readme:
      "Turns one or more outcomes.jsonl files into a single local HTML page: total protected calls, PASS / FAIL / UNKNOWN by tool and by day, what each reason means, and the latency Fourgate added (median and p95). The page has no JavaScript and makes no network requests.",
    link: { href: "/sample-report.html", label: "Open the page the demo run produced" },
  },
];
