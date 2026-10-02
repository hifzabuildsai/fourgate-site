"use client";

/**
 * Fourgate data flow, drawn from "What runs where" in PILOT.md.
 * Desktop: a three-row loop. Mobile: the same steps as a vertical chain.
 * With `interactive`, every node is a button; hovering, focusing or tapping it
 * shows what it holds and what it never contains (PILOT.md, "What is stored").
 */

import { useState, type KeyboardEvent } from "react";

type Key = "agent" | "guard" | "server" | "sor" | "verifier" | "verdict" | "log" | "summary";
type Node = { key: Key; title: string; sub: string; local?: boolean };

export type FlowLabels = {
  call: string;
  forward: string;
  write: string;
  extract: string;
  readback: string;
  record: string;
  summarize: string;
};

const defaultLabels: FlowLabels = {
  call: "tools/call",
  forward: "unchanged",
  write: "its own write",
  extract: "contracted fields only",
  readback: "independent read-only GET",
  record: "structure only",
  summarize: "local HTML",
};

const nodes: Record<Key, Node> = {
  agent: { key: "agent", title: "Your agent", sub: "MCP client" },
  guard: { key: "guard", title: "fourgate guard", sub: "local process", local: true },
  server: { key: "server", title: "Your MCP server", sub: "no code changes" },
  sor: { key: "sor", title: "System of record", sub: "the API you write to" },
  verifier: { key: "verifier", title: "Verifier", sub: "local, no LLM", local: true },
  verdict: { key: "verdict", title: "Verdict", sub: "", local: true },
  log: { key: "log", title: "outcomes.jsonl", sub: "local file", local: true },
  summary: { key: "summary", title: "fourgate summary", sub: "local page", local: true },
};

type Detail = { role: string; holds: string[]; never: string[] };

// Text from PILOT.md ("What runs where", "What is stored", "Credentials", "Failure behavior").
const details: Record<Key, Detail> = {
  agent: {
    role: "Calls your tools as today. In shadow mode it receives exactly the same bytes it would without Fourgate. In enforce mode, on a confirmed FAIL, one attributed verdict is added before the tool's original response.",
    holds: ["Nothing from Fourgate"],
    never: [],
  },
  guard: {
    role: "Local process on your machine. Forwards the call unchanged, then extracts only the contracted fields (e.g. record ID, title) from a success result.",
    holds: ["Runtime contract: tool names, which fields to extract, the verifier command, environment variable names"],
    never: ["Credentials", "Customer data"],
  },
  server: {
    role: "Keeps its own write credential, exactly as today, and makes its own API calls.",
    holds: ["Its own write credential"],
    never: ["The verifier's read-only credential, when listed in verifier.secret_env: guard removes it from the server's environment"],
  },
  verifier: {
    role: "Local. Reads the record back with an HTTPS GET, using a separate read-only credential that you create. It reads the token from its environment at call time and sends it only to the read-back endpoint you configured.",
    holds: ["Read-back config: the GET URL template, expected fields, status rules, the environment variable name of the read token"],
    never: ["The token itself"],
  },
  sor: {
    role: "Your API. The only new network traffic Fourgate adds is the verifier's GET request to the endpoint you configure. It never writes, deletes, or retries a write.",
    holds: ["Nothing from Fourgate"],
    never: [],
  },
  verdict: {
    role: "PASS, FAIL or UNKNOWN from a deterministic read-back check. No LLM makes the decision. Any per-call problem is UNKNOWN and fails open.",
    holds: [],
    never: [],
  },
  log: {
    role: "Outcome log at a path you choose.",
    holds: [
      "Per protected call: time, server label, tool name, mode, PASS/FAIL/UNKNOWN, reason code, names of checked fields, time the check added",
    ],
    never: ["Arguments", "Field values", "Record IDs", "Response bodies", "Credentials"],
  },
  summary: {
    role: "fourgate summary turns the log into one local page. You choose whether to share it.",
    holds: ["Counts and charts built from the outcome log"],
    never: ["Same exclusions as the log", "JavaScript", "Network requests"],
  },
};

const W = 180;
const H = 72;

type Interact = { active: Key | null; onPick?: (k: Key) => void };

function Box({ n, x, y, ix }: { n: Node; x: number; y: number; ix: Interact }) {
  const isActive = ix.active === n.key;
  const pick = ix.onPick;
  const handlers = pick
    ? {
        role: "button",
        tabIndex: 0,
        "aria-pressed": isActive,
        "aria-label": `${n.title}: show what it holds`,
        onClick: () => pick(n.key),
        onMouseEnter: () => pick(n.key),
        onFocus: () => pick(n.key),
        onKeyDown: (e: KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            pick(n.key);
          }
        },
        className: "cursor-pointer outline-none [&:focus-visible>rect:first-child]:stroke-[3]",
      }
    : {};
  return (
    <g {...handlers}>
      <rect
        x={x}
        y={y}
        width={W}
        height={H}
        rx={10}
        fill={isActive ? "#1d2530" : "var(--surface)"}
        stroke={isActive ? "var(--bone)" : n.local ? "color-mix(in srgb, var(--bone) 70%, transparent)" : "var(--line)"}
        strokeWidth={isActive ? 2 : n.local ? 1.4 : 1}
      />
      <text x={x + W / 2} y={y + 30} textAnchor="middle" fill="var(--bone)" fontSize="15" fontWeight="600">
        {n.title}
      </text>
      {n.key === "verdict" ? (
        <text x={x + W / 2} y={y + 52} textAnchor="middle" fontSize="12.5" fontFamily="var(--font-jetbrains-mono)">
          <tspan fill="var(--pass)">PASS</tspan>
          <tspan fill="var(--muted)"> / </tspan>
          <tspan fill="var(--fail)">FAIL</tspan>
          <tspan fill="var(--muted)"> / </tspan>
          <tspan fill="var(--unknown)">UNKNOWN</tspan>
        </text>
      ) : (
        <text x={x + W / 2} y={y + 52} textAnchor="middle" fill="var(--muted)" fontSize="12.5">
          {n.sub}
        </text>
      )}
    </g>
  );
}

function Label({ x, y, children, anchor = "middle" }: { x: number; y: number; children: string; anchor?: "middle" | "start" }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fill="var(--muted)" fontSize="12.5" fontFamily="var(--font-jetbrains-mono)">
      {children}
    </text>
  );
}

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <marker id={`${id}-a`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0 10 5 0 10z" fill="var(--muted)" />
      </marker>
      <marker id={`${id}-b`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0 10 5 0 10z" fill="var(--bone)" />
      </marker>
    </defs>
  );
}

function Desktop({ labels, id, title, ix }: { labels: FlowLabels; id: string; title: string; ix: Interact }) {
  const xs = [0, 300, 600, 900];
  const r1 = 34;
  const r2 = 190;
  const r3 = 346;
  const line = { stroke: "var(--muted)", strokeWidth: 1.3, fill: "none", markerEnd: `url(#${id}-a)` };
  const local = { stroke: "var(--bone)", strokeWidth: 1.3, fill: "none", markerEnd: `url(#${id}-b)` };
  return (
    <svg viewBox="-4 0 1088 440" role="group" aria-labelledby={`${id}-t`} className="hidden h-auto w-full md:block">
      <title id={`${id}-t`}>{title}</title>
      <Defs id={id} />
      <path d={`M${xs[0] + W + 4} ${r1 + H / 2}H${xs[1] - 6}`} {...line} />
      <path d={`M${xs[1] + W + 4} ${r1 + H / 2}H${xs[2] - 6}`} {...line} />
      <path d={`M${xs[2] + W + 4} ${r1 + H / 2}H${xs[3] - 6}`} {...line} />
      <Label x={(xs[0] + W + xs[1]) / 2} y={r1 + H / 2 - 10}>{labels.call}</Label>
      <Label x={(xs[1] + W + xs[2]) / 2} y={r1 + H / 2 - 10}>{labels.forward}</Label>
      <Label x={(xs[2] + W + xs[3]) / 2} y={r1 + H / 2 - 10}>{labels.write}</Label>
      <path d={`M${xs[1] + W / 2} ${r1 + H + 4}V${r2 - 6}`} {...local} />
      <Label x={xs[1] + W / 2 + 12} y={(r1 + H + r2) / 2 + 4} anchor="start">{labels.extract}</Label>
      <path d={`M${xs[1] + W + 4} ${r2 + H / 2}H${xs[3] + W / 2}V${r1 + H + 6}`} {...local} strokeDasharray="6 5" />
      <Label x={(xs[2] + xs[3] + W) / 2} y={r2 + H / 2 - 10}>{labels.readback}</Label>
      <path d={`M${xs[1] + W / 2} ${r2 + H + 4}V${r3 - 6}`} {...local} />
      <path d={`M${xs[1] + W + 4} ${r3 + H / 2}H${xs[2] - 6}`} {...local} />
      <path d={`M${xs[2] + W + 4} ${r3 + H / 2}H${xs[3] - 6}`} {...local} />
      <Label x={(xs[1] + W + xs[2]) / 2} y={r3 + H / 2 - 10}>{labels.record}</Label>
      <Label x={(xs[2] + W + xs[3]) / 2} y={r3 + H / 2 - 10}>{labels.summarize}</Label>

      <Box n={nodes.agent} x={xs[0]} y={r1} ix={ix} />
      <Box n={nodes.guard} x={xs[1]} y={r1} ix={ix} />
      <Box n={nodes.server} x={xs[2]} y={r1} ix={ix} />
      <Box n={nodes.sor} x={xs[3]} y={r1} ix={ix} />
      <Box n={nodes.verifier} x={xs[1]} y={r2} ix={ix} />
      <Box n={nodes.verdict} x={xs[1]} y={r3} ix={ix} />
      <Box n={nodes.log} x={xs[2]} y={r3} ix={ix} />
      <Box n={nodes.summary} x={xs[3]} y={r3} ix={ix} />

      <rect x={0} y={r3 + 10} width={14} height={14} rx={3} fill="none" stroke="var(--bone)" strokeOpacity="0.7" strokeWidth="1.4" />
      <text x={22} y={r3 + 22} fill="var(--muted)" fontSize="12.5">Fourgate, on your machine</text>
      <rect x={0} y={r3 + 36} width={14} height={14} rx={3} fill="none" stroke="var(--line)" />
      <text x={22} y={r3 + 48} fill="var(--muted)" fontSize="12.5">Your existing systems</text>
    </svg>
  );
}

function wrapText(text: string, max: number): string[] {
  const lines: string[] = [];
  let cur = "";
  for (const w of text.split(" ")) {
    if (cur && `${cur} ${w}`.length > max) {
      lines.push(cur);
      cur = w;
    } else cur = cur ? `${cur} ${w}` : w;
  }
  if (cur) lines.push(cur);
  return lines;
}

function Mobile({ labels, id, title, ix }: { labels: FlowLabels; id: string; title: string; ix: Interact }) {
  const steps: { n: Node; label?: string; local?: boolean; up?: boolean }[] = [
    { n: nodes.agent, label: labels.call },
    { n: nodes.guard, label: labels.forward },
    { n: nodes.server, label: labels.write },
    { n: nodes.sor, label: labels.readback, local: true, up: true },
    { n: nodes.verifier, local: true },
    { n: nodes.verdict, label: labels.record, local: true },
    { n: nodes.log, label: labels.summarize, local: true },
    { n: nodes.summary },
  ];
  const gap = 54;
  const bw = 300;
  const height = steps.length * (H + gap) - gap + 4;
  return (
    <svg viewBox={`-2 0 304 ${height}`} role="group" aria-labelledby={`${id}-mt`} className="mx-auto block h-auto w-full max-w-sm md:hidden">
      <title id={`${id}-mt`}>{title}</title>
      <Defs id={`${id}-m`} />
      {steps.map((s, i) => {
        const y = i * (H + gap);
        return (
          <g key={s.n.key}>
            {i < steps.length - 1 && (
              <>
                <path
                  d={s.up ? `M${bw / 2} ${y + H + gap - 4}V${y + H + 6}` : `M${bw / 2} ${y + H + 4}V${y + H + gap - 6}`}
                  stroke={s.local ? "var(--bone)" : "var(--muted)"}
                  strokeWidth={1.3}
                  strokeDasharray={s.up ? "6 5" : undefined}
                  markerEnd={`url(#${id}-m-${s.local ? "b" : "a"})`}
                />
                {s.label &&
                  wrapText(s.label, 18).map((line, li, all) => (
                    <Label key={li} x={bw / 2 + 10} y={y + H + gap / 2 + 4 + (li - (all.length - 1) / 2) * 15} anchor="start">
                      {line}
                    </Label>
                  ))}
              </>
            )}
            <Box n={s.n} x={(bw - W) / 2} y={y} ix={ix} />
          </g>
        );
      })}
    </svg>
  );
}

/** Interactive phone layout: the same chain as a list; each node expands in place. */
function MobileList({ labels, active, onPick }: { labels: FlowLabels; active: Key; onPick: (k: Key) => void }) {
  const steps: { n: Node; label?: string }[] = [
    { n: nodes.agent, label: labels.call },
    { n: nodes.guard, label: labels.forward },
    { n: nodes.server, label: labels.write },
    { n: nodes.sor, label: `read back by the verifier: ${labels.readback}` },
    { n: nodes.verifier },
    { n: nodes.verdict, label: labels.record },
    { n: nodes.log, label: labels.summarize },
    { n: nodes.summary },
  ];
  return (
    <ol className="md:hidden">
      {steps.map((s) => {
        const open = active === s.n.key;
        const d = details[s.n.key];
        return (
          <li key={s.n.key}>
            <button
              type="button"
              aria-expanded={open}
              onClick={() => onPick(s.n.key)}
              className={`flex w-full items-center justify-between gap-3 rounded-[10px] border px-4 py-3 text-left ${
                open ? "border-bone bg-[#1d2530]" : s.n.local ? "border-bone/60 bg-surface" : "border-line bg-surface"
              }`}
            >
              <span>
                <span className="block font-medium text-bone">{s.n.title}</span>
                <span className="block text-cap text-muted">{s.n.key === "verdict" ? "PASS / FAIL / UNKNOWN" : s.n.sub}</span>
              </span>
              <svg aria-hidden="true" viewBox="0 0 16 16" className={`h-3.5 w-3.5 shrink-0 text-muted ${open ? "rotate-45" : ""}`}>
                <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </button>
            {open && (
              <div className="px-4 pb-1 pt-3">
                <p className="text-small text-muted">{d.role}</p>
                <DetailList title="Holds" items={d.holds} />
                <DetailList title="Never contains" items={d.never} />
              </div>
            )}
            {s.label && (
              <p className="flex items-center gap-3 py-2 pl-6 font-mono text-cap text-muted">
                <span aria-hidden="true" className="h-5 w-px bg-line" />
                {s.label}
              </p>
            )}
            {!s.label && s.n.key !== "summary" && <span aria-hidden="true" className="ml-6 block h-4 w-px bg-line" />}
          </li>
        );
      })}
    </ol>
  );
}

function DetailList({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div className="mt-4">
      <p className="text-cap text-muted">{title}</p>
      <ul className="mt-1.5 space-y-1 text-small text-bone">
        {items.map((it) => (
          <li key={it}>{it}</li>
        ))}
      </ul>
    </div>
  );
}

export default function FlowDiagram({
  id = "flow",
  labels = defaultLabels,
  interactive = false,
  title = "Fourgate data flow: your agent calls your MCP server through fourgate guard; after a success result, a local verifier reads the system of record back with an independent read-only GET, records PASS, FAIL or UNKNOWN to a local outcomes.jsonl file, and fourgate summary turns that file into a local HTML page.",
}: {
  id?: string;
  labels?: FlowLabels;
  interactive?: boolean;
  title?: string;
}) {
  const [active, setActive] = useState<Key>("guard");
  const ix: Interact = interactive ? { active, onPick: setActive } : { active: null };
  const d = details[active];

  return (
    <figure className={interactive ? "grid gap-6 xl:grid-cols-[1fr_19rem]" : ""}>
      <div className={interactive ? "md:rounded-[14px] md:border md:border-line md:p-7" : "rounded-[14px] border border-line p-4 sm:p-7"}>
        <Desktop labels={labels} id={id} title={title} ix={ix} />
        {interactive ? (
          <MobileList labels={labels} active={active} onPick={setActive} />
        ) : (
          <Mobile labels={labels} id={id} title={title} ix={ix} />
        )}
      </div>
      {interactive && (
        <figcaption aria-live="polite" className="hidden rounded-[14px] border border-line bg-surface p-5 md:block xl:sticky xl:top-20 xl:self-start">
          <p className="text-cap text-muted">Select a box. Showing:</p>
          <p className="mt-1 font-medium text-bone">{nodes[active].title}</p>
          <p className="mt-2 text-small text-muted">{d.role}</p>
          <DetailList title="Holds" items={d.holds} />
          <DetailList title="Never contains" items={d.never} />
        </figcaption>
      )}
    </figure>
  );
}
