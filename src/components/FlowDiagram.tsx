"use client";

/**
 * Fourgate data flow, drawn from "What runs where" in PILOT.md.
 * Hover or focus a node: its edges flow in the data direction, unrelated nodes
 * dim, and what it stores / never contains is shown (PILOT.md, "What is stored").
 * The legend entries are toggles that highlight Fourgate's parts or yours.
 * variant "tooltip" (home) shows details next to the node; "panel" (security)
 * keeps the last selection in a side panel. Phones get an expandable list.
 */

import { useId, useState, type KeyboardEvent } from "react";

type Key = "agent" | "guard" | "server" | "sor" | "verifier" | "verdict" | "log" | "summary";
type Group = "local" | "existing";
type Node = { key: Key; title: string; sub: string; group: Group; x: number; y: number };

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

const W = 180;
const H = 72;
const XS = [0, 300, 600, 900];
const R1 = 34;
const R2 = 190;
const R3 = 346;

const nodes: Record<Key, Node> = {
  agent: { key: "agent", title: "Your agent", sub: "MCP client", group: "existing", x: XS[0], y: R1 },
  guard: { key: "guard", title: "fourgate guard", sub: "local process", group: "local", x: XS[1], y: R1 },
  server: { key: "server", title: "Your MCP server", sub: "no code changes", group: "existing", x: XS[2], y: R1 },
  sor: { key: "sor", title: "System of record", sub: "the API you write to", group: "existing", x: XS[3], y: R1 },
  verifier: { key: "verifier", title: "Verifier", sub: "local, no LLM", group: "local", x: XS[1], y: R2 },
  verdict: { key: "verdict", title: "Verdict", sub: "", group: "local", x: XS[1], y: R3 },
  log: { key: "log", title: "outcomes.jsonl", sub: "local file", group: "local", x: XS[2], y: R3 },
  summary: { key: "summary", title: "fourgate summary", sub: "local page", group: "local", x: XS[3], y: R3 },
};
const order: Key[] = ["agent", "guard", "server", "sor", "verifier", "verdict", "log", "summary"];

type Edge = { id: string; from: Key; to: Key; d: string; label: keyof FlowLabels; lx: number; ly: number; anchor?: "start"; dashed?: boolean };

const mid = (a: number, b: number) => (a + b) / 2;
const edges: Edge[] = [
  { id: "call", from: "agent", to: "guard", d: `M${XS[0] + W + 4} ${R1 + H / 2}H${XS[1] - 6}`, label: "call", lx: mid(XS[0] + W, XS[1]), ly: R1 + H / 2 - 10 },
  { id: "forward", from: "guard", to: "server", d: `M${XS[1] + W + 4} ${R1 + H / 2}H${XS[2] - 6}`, label: "forward", lx: mid(XS[1] + W, XS[2]), ly: R1 + H / 2 - 10 },
  { id: "write", from: "server", to: "sor", d: `M${XS[2] + W + 4} ${R1 + H / 2}H${XS[3] - 6}`, label: "write", lx: mid(XS[2] + W, XS[3]), ly: R1 + H / 2 - 10 },
  { id: "extract", from: "guard", to: "verifier", d: `M${XS[1] + W / 2} ${R1 + H + 4}V${R2 - 6}`, label: "extract", lx: XS[1] + W / 2 + 12, ly: mid(R1 + H, R2) + 4, anchor: "start" },
  { id: "readback", from: "verifier", to: "sor", d: `M${XS[1] + W + 4} ${R2 + H / 2}H${XS[3] + W / 2}V${R1 + H + 6}`, label: "readback", lx: mid(XS[2], XS[3] + W), ly: R2 + H / 2 - 10, dashed: true },
  { id: "decide", from: "verifier", to: "verdict", d: `M${XS[1] + W / 2} ${R2 + H + 4}V${R3 - 6}`, label: "record", lx: -999, ly: -999 },
  { id: "record", from: "verdict", to: "log", d: `M${XS[1] + W + 4} ${R3 + H / 2}H${XS[2] - 6}`, label: "record", lx: mid(XS[1] + W, XS[2]), ly: R3 + H / 2 - 10 },
  { id: "summarize", from: "log", to: "summary", d: `M${XS[2] + W + 4} ${R3 + H / 2}H${XS[3] - 6}`, label: "summarize", lx: mid(XS[2] + W, XS[3]), ly: R3 + H / 2 - 10 },
];

type Detail = { role: string; stores: string[]; never: string[] };

// Text from PILOT.md ("What runs where", "What is stored", "Credentials", "Failure behavior").
const details: Record<Key, Detail> = {
  agent: {
    role: "Calls your tools as today. In shadow mode it receives exactly the same bytes it would without Fourgate. In enforce mode, on a confirmed FAIL, one attributed verdict is added before the tool's original response.",
    stores: ["Nothing from Fourgate"],
    never: [],
  },
  guard: {
    role: "Local process on your machine. Forwards the call unchanged, then extracts only the contracted fields (e.g. record ID, title) from a success result.",
    stores: ["Runtime contract: tool names, which fields to extract, the verifier command, environment variable names"],
    never: ["Credentials", "Customer data"],
  },
  server: {
    role: "Keeps its own write credential, exactly as today, and makes its own API calls.",
    stores: ["Its own write credential"],
    never: ["The verifier's read-only credential, when listed in verifier.secret_env: guard removes it from the server's environment"],
  },
  verifier: {
    role: "Local. Reads the record back with an HTTPS GET, using a separate read-only credential that you create. It reads the token from its environment at call time and sends it only to the read-back endpoint you configured.",
    stores: ["Read-back config: the GET URL template, expected fields, status rules, the environment variable name of the read token"],
    never: ["The token itself"],
  },
  sor: {
    role: "Your API. The only new network traffic Fourgate adds is the verifier's GET request to the endpoint you configure. It never writes, deletes, or retries a write.",
    stores: ["Nothing from Fourgate"],
    never: [],
  },
  verdict: {
    role: "PASS, FAIL or UNKNOWN from a deterministic read-back check. No LLM makes the decision. Any per-call problem is UNKNOWN and fails open.",
    stores: [],
    never: [],
  },
  log: {
    role: "Outcome log at a path you choose.",
    stores: ["Per protected call: time, server label, tool name, mode, PASS/FAIL/UNKNOWN, reason code, names of checked fields, time the check added"],
    never: ["Arguments", "Field values", "Record IDs", "Response bodies", "Credentials"],
  },
  summary: {
    role: "fourgate summary turns the log into one local page. You choose whether to share it.",
    stores: ["Counts and charts built from the outcome log"],
    never: ["Same exclusions as the log", "JavaScript", "Network requests"],
  },
};

const neighbors = (k: Key) => new Set<Key>([k, ...edges.filter((e) => e.from === k || e.to === k).flatMap((e) => [e.from, e.to])]);

function List({ title, items, compact = false }: { title: string; items: string[]; compact?: boolean }) {
  if (!items.length) return null;
  return (
    <div className={compact ? "mt-2" : "mt-3"}>
      <p className="text-cap text-muted">{title}</p>
      <ul className={`mt-1 space-y-0.5 text-foreground ${compact ? "text-cap" : "text-small"}`}>
        {items.map((it) => (
          <li key={it}>{it}</li>
        ))}
      </ul>
    </div>
  );
}

function DetailBody({ k, compact = false }: { k: Key; compact?: boolean }) {
  const d = details[k];
  return (
    <>
      <p className="font-medium text-foreground">{nodes[k].title}</p>
      <p className={`mt-1.5 text-muted ${compact ? "text-cap" : "text-small"}`}>{d.role}</p>
      <List title="Stores" items={d.stores} compact={compact} />
      <List title="Never contains" items={d.never} compact={compact} />
    </>
  );
}

/** Beside the node (left of it in the right-hand column), opening upward in the bottom row. */
function tipPosition(n: Node) {
  const pct = (v: number, of: number) => `${(v / of) * 100}%`;
  const horizontal = n.x >= XS[3] ? { right: pct(1088 - (n.x - 10), 1088) } : { left: pct(n.x + W + 14, 1088) };
  const vertical = n.y >= R3 ? { bottom: pct(440 - (n.y + H), 440) } : { top: pct(n.y, 440) };
  return { ...horizontal, ...vertical };
}

/** Connector text between consecutive items in the phone list. */
function mobileLabel(k: Key, labels: FlowLabels): string {
  const map: Partial<Record<Key, string>> = {
    agent: labels.call,
    guard: labels.forward,
    server: labels.write,
    sor: `read back by the verifier: ${labels.readback}`,
    verdict: labels.record,
    log: labels.summarize,
  };
  return map[k] ?? "";
}

export default function FlowDiagram({
  id = "flow",
  labels = defaultLabels,
  variant = "tooltip",
  title = "Fourgate data flow: your agent calls your MCP server through fourgate guard; after a success result, a local verifier reads the system of record back with an independent read-only GET, records PASS, FAIL or UNKNOWN to a local outcomes.jsonl file, and fourgate summary turns that file into a local HTML page.",
}: {
  id?: string;
  labels?: FlowLabels;
  variant?: "tooltip" | "panel";
  title?: string;
}) {
  const [focus, setFocus] = useState<Key | null>(null);
  const [selected, setSelected] = useState<Key>("guard");
  const [group, setGroup] = useState<Group | null>(null);
  const uid = useId();

  const lit = focus ? neighbors(focus) : null;
  const nodeDim = (n: Node) => (lit ? !lit.has(n.key) : group ? n.group !== group : false);
  const edgeActive = (e: Edge) => (focus ? e.from === focus || e.to === focus : false);
  const edgeDim = (e: Edge) =>
    focus ? !edgeActive(e) : group ? nodes[e.from].group !== group || nodes[e.to].group !== group : false;

  const pick = (k: Key | null) => {
    setFocus(k);
    if (k) setSelected(k);
  };

  const nodeHandlers = (k: Key) => ({
    role: "button",
    tabIndex: 0,
    "aria-label": `${nodes[k].title}: what it stores`,
    "aria-describedby": variant === "tooltip" && focus === k ? `${uid}-tip` : undefined,
    onMouseEnter: () => pick(k),
    onMouseLeave: () => setFocus(null),
    onFocus: () => pick(k),
    onBlur: () => setFocus(null),
    onClick: () => pick(k),
    onKeyDown: (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        pick(k);
      } else if (e.key === "Escape") setFocus(null);
    },
  });

  const shown = variant === "panel" ? selected : focus;
  const tipNode = focus ? nodes[focus] : null;

  return (
    <figure className={variant === "panel" ? "grid gap-6 xl:grid-cols-[1fr_19rem]" : ""}>
      <div className="md:rounded-[16px] md:border md:border-line md:bg-surface md:p-7">
        <div className="relative hidden md:block">
          <svg viewBox="-4 0 1088 440" role="group" aria-labelledby={`${id}-t`} className="h-auto w-full">
            <title id={`${id}-t`}>{title}</title>
            <defs>
              <marker id={`${id}-a`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0 0 10 5 0 10z" fill="var(--muted)" />
              </marker>
              <marker id={`${id}-b`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0 0 10 5 0 10z" fill="var(--foreground)" />
              </marker>
            </defs>

            {edges.map((e) => {
              const active = edgeActive(e);
              return (
                <g key={e.id} style={{ opacity: edgeDim(e) ? 0.25 : 1, transition: "opacity 200ms ease" }}>
                  <path
                    d={e.d}
                    fill="none"
                    stroke={active ? "var(--foreground)" : "var(--muted)"}
                    strokeWidth={active ? 1.8 : 1.3}
                    strokeDasharray={e.dashed && !active ? "6 5" : undefined}
                    className={active ? "fg-flow" : undefined}
                    markerEnd={`url(#${id}-${active ? "b" : "a"})`}
                  />
                  {e.lx > 0 && (
                    <text
                      x={e.lx}
                      y={e.ly}
                      textAnchor={e.anchor ?? "middle"}
                      fill={active ? "var(--foreground)" : "var(--muted)"}
                      fontSize="12.5"
                      fontFamily="var(--font-geist-mono)"
                    >
                      {labels[e.label]}
                    </text>
                  )}
                </g>
              );
            })}

            {order.map((k) => {
              const n = nodes[k];
              const active = focus === k || (variant === "panel" && selected === k && !focus);
              return (
                <g
                  key={k}
                  {...nodeHandlers(k)}
                  className="cursor-pointer outline-none [&:focus-visible>rect:first-child]:stroke-[var(--accent)] [&:focus-visible>rect:first-child]:stroke-[2.5]"
                  style={{ opacity: nodeDim(n) ? 0.3 : 1, transition: "opacity 200ms ease" }}
                >
                  <rect
                    x={n.x}
                    y={n.y}
                    width={W}
                    height={H}
                    rx={12}
                    fill={active ? "var(--raised)" : "var(--background)"}
                    stroke={active ? "var(--foreground)" : n.group === "local" ? "color-mix(in srgb, var(--foreground) 55%, transparent)" : "var(--line-strong)"}
                    strokeWidth={active ? 1.8 : n.group === "local" ? 1.3 : 1}
                    style={{ transition: "fill 150ms ease, stroke 150ms ease" }}
                  />
                  <text x={n.x + W / 2} y={n.y + 30} textAnchor="middle" fill="var(--foreground)" fontSize="15" fontWeight="600">
                    {n.title}
                  </text>
                  {k === "verdict" ? (
                    <text x={n.x + W / 2} y={n.y + 52} textAnchor="middle" fontSize="12.5" fontFamily="var(--font-geist-mono)">
                      <tspan fill="var(--pass)">PASS</tspan>
                      <tspan fill="var(--muted)"> / </tspan>
                      <tspan fill="var(--fail)">FAIL</tspan>
                      <tspan fill="var(--muted)"> / </tspan>
                      <tspan fill="var(--unknown)">UNKNOWN</tspan>
                    </text>
                  ) : (
                    <text x={n.x + W / 2} y={n.y + 52} textAnchor="middle" fill="var(--muted)" fontSize="12.5">
                      {n.sub}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {variant === "tooltip" && tipNode && (
            <div
              id={`${uid}-tip`}
              role="tooltip"
              className="pointer-events-none absolute z-10 w-72 rounded-[12px] border border-line bg-background p-4 shadow-[0_8px_30px_rgb(0_0_0/0.12)]"
              style={tipPosition(tipNode)}
            >
              <DetailBody k={tipNode.key} compact />
            </div>
          )}
        </div>

        {/* Phones: the same chain as a list; each node expands in place. */}
        <ol className="md:hidden">
          {order.map((k, i) => {
            const n = nodes[k];
            const open = shown === k;
            return (
              <li key={k} style={{ opacity: group && n.group !== group ? 0.35 : 1 }}>
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => (open && variant === "tooltip" ? setFocus(null) : pick(k))}
                  className={`flex w-full items-center justify-between gap-3 rounded-[12px] border px-4 py-3 text-left ${
                    open ? "border-foreground bg-raised" : n.group === "local" ? "border-foreground/40 bg-background" : "border-line bg-background"
                  }`}
                >
                  <span>
                    <span className="block font-medium text-foreground">{n.title}</span>
                    <span className="block text-cap text-muted">{k === "verdict" ? "PASS / FAIL / UNKNOWN" : n.sub}</span>
                  </span>
                  <svg aria-hidden="true" viewBox="0 0 16 16" className={`h-3.5 w-3.5 shrink-0 text-muted transition-transform ${open ? "rotate-45" : ""}`}>
                    <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                </button>
                {open && (
                  <div className="px-4 pb-1 pt-3">
                    <DetailBody k={k} />
                  </div>
                )}
                {i < order.length - 1 && (
                  <p className="flex items-center gap-3 py-2 pl-6 font-mono text-cap text-muted">
                    <span aria-hidden="true" className="h-5 w-px bg-line-strong" />
                    {mobileLabel(k, labels)}
                  </p>
                )}
              </li>
            );
          })}
        </ol>

        {/* Legend: real toggles that highlight each group. */}
        <div className="mt-4 flex flex-wrap gap-2 md:mt-5" role="group" aria-label="Highlight">
          {(
            [
              ["local", "Fourgate, on your machine"],
              ["existing", "Your existing systems"],
            ] as const
          ).map(([g, label]) => (
            <button
              key={g}
              type="button"
              aria-pressed={group === g}
              onClick={() => setGroup(group === g ? null : g)}
              className="inline-flex min-h-9 items-center gap-2 rounded-full border border-line px-3 text-cap text-muted hover:text-foreground aria-pressed:border-foreground aria-pressed:text-foreground"
            >
              <span
                aria-hidden="true"
                className={`h-3 w-3 rounded-[3px] border ${g === "local" ? "border-foreground/70" : "border-line-strong"} ${group === g ? "bg-foreground" : ""}`}
              />
              {label}
            </button>
          ))}
        </div>
      </div>

      {variant === "panel" && (
        <figcaption aria-live="polite" className="hidden rounded-[16px] border border-line bg-surface p-5 md:block xl:sticky xl:top-20 xl:self-start">
          <p className="mb-1 text-cap text-muted">Select a box. Showing:</p>
          <DetailBody k={selected} />
        </figcaption>
      )}
    </figure>
  );
}
