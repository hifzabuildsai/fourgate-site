/**
 * Fourgate data flow, drawn from the diagram in PILOT.md ("What runs where").
 * Desktop: a three-row loop. Mobile: the same steps as a vertical chain.
 */

type Node = { key: string; title: string; sub: string; local?: boolean; verdict?: boolean };

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

const nodes: Record<string, Node> = {
  agent: { key: "agent", title: "Your agent", sub: "MCP client" },
  guard: { key: "guard", title: "fourgate guard", sub: "local process", local: true },
  server: { key: "server", title: "Your MCP server", sub: "no code changes" },
  sor: { key: "sor", title: "System of record", sub: "the API you write to" },
  verifier: { key: "verifier", title: "Verifier", sub: "local · deterministic, no LLM", local: true },
  verdict: { key: "verdict", title: "Verdict", sub: "", local: true, verdict: true },
  log: { key: "log", title: "outcomes.jsonl", sub: "local file", local: true },
  summary: { key: "summary", title: "fourgate summary", sub: "local page", local: true },
};

const W = 180;
const H = 72;

function Box({ n, x, y }: { n: Node; x: number; y: number }) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={W}
        height={H}
        rx={12}
        fill="var(--surface)"
        stroke={n.local ? "var(--accent)" : "var(--border-strong)"}
        strokeWidth={n.local ? 1.5 : 1}
      />
      <text x={x + W / 2} y={y + 30} textAnchor="middle" fill="var(--text)" fontSize="15" fontWeight="600">
        {n.title}
      </text>
      {n.verdict ? (
        <text x={x + W / 2} y={y + 52} textAnchor="middle" fontSize="12.5" fontFamily="var(--font-mono)" fontWeight="600">
          <tspan fill="var(--pass)">PASS</tspan>
          <tspan fill="var(--subtle)"> / </tspan>
          <tspan fill="var(--fail)">FAIL</tspan>
          <tspan fill="var(--subtle)"> / </tspan>
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

function Label({ x, y, children, anchor = "middle" }: { x: number; y: number; children: string; anchor?: "middle" | "start" | "end" }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fill="var(--muted)" fontSize="12.5" fontFamily="var(--font-mono)">
      {children}
    </text>
  );
}

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0 10 5 0 10z" fill="var(--subtle)" />
      </marker>
      <marker id={`${id}-arrow-accent`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0 10 5 0 10z" fill="var(--accent)" />
      </marker>
    </defs>
  );
}

function Desktop({ labels, id, title }: { labels: FlowLabels; id: string; title: string }) {
  const xs = [0, 300, 600, 900];
  const r1 = 34;
  const r2 = 190;
  const r3 = 346;
  const line = { stroke: "var(--subtle)", strokeWidth: 1.5, fill: "none", markerEnd: `url(#${id}-arrow)` };
  const accentLine = { stroke: "var(--accent)", strokeWidth: 1.5, fill: "none", markerEnd: `url(#${id}-arrow-accent)` };
  return (
    <svg viewBox="-4 0 1088 440" role="img" aria-labelledby={`${id}-title`} className="hidden h-auto w-full md:block">
      <title id={`${id}-title`}>{title}</title>
      <Defs id={id} />
      {/* Row 1: the normal call path */}
      <Box n={nodes.agent} x={xs[0]} y={r1} />
      <Box n={nodes.guard} x={xs[1]} y={r1} />
      <Box n={nodes.server} x={xs[2]} y={r1} />
      <Box n={nodes.sor} x={xs[3]} y={r1} />
      <path d={`M${xs[0] + W + 4} ${r1 + H / 2}H${xs[1] - 6}`} {...line} />
      <path d={`M${xs[1] + W + 4} ${r1 + H / 2}H${xs[2] - 6}`} {...line} />
      <path d={`M${xs[2] + W + 4} ${r1 + H / 2}H${xs[3] - 6}`} {...line} />
      <Label x={(xs[0] + W + xs[1]) / 2} y={r1 + H / 2 - 10}>{labels.call}</Label>
      <Label x={(xs[1] + W + xs[2]) / 2} y={r1 + H / 2 - 10}>{labels.forward}</Label>
      <Label x={(xs[2] + W + xs[3]) / 2} y={r1 + H / 2 - 10}>{labels.write}</Label>

      {/* Row 2: verification */}
      <Box n={nodes.verifier} x={xs[1]} y={r2} />
      <path d={`M${xs[1] + W / 2} ${r1 + H + 4}V${r2 - 6}`} {...accentLine} />
      <Label x={xs[1] + W / 2 + 12} y={(r1 + H + r2) / 2 + 4} anchor="start">{labels.extract}</Label>
      <path
        d={`M${xs[1] + W + 4} ${r2 + H / 2}H${xs[3] + W / 2}V${r1 + H + 6}`}
        {...accentLine}
        strokeDasharray="6 5"
      />
      <Label x={(xs[2] + xs[3] + W) / 2} y={r2 + H / 2 - 10}>{labels.readback}</Label>

      {/* Row 3: verdict and local record */}
      <Box n={nodes.verdict} x={xs[1]} y={r3} />
      <Box n={nodes.log} x={xs[2]} y={r3} />
      <Box n={nodes.summary} x={xs[3]} y={r3} />
      <path d={`M${xs[1] + W / 2} ${r2 + H + 4}V${r3 - 6}`} {...accentLine} />
      <path d={`M${xs[1] + W + 4} ${r3 + H / 2}H${xs[2] - 6}`} {...accentLine} />
      <path d={`M${xs[2] + W + 4} ${r3 + H / 2}H${xs[3] - 6}`} {...accentLine} />
      <Label x={(xs[1] + W + xs[2]) / 2} y={r3 + H / 2 - 10}>{labels.record}</Label>
      <Label x={(xs[2] + W + xs[3]) / 2} y={r3 + H / 2 - 10}>{labels.summarize}</Label>

      {/* Legend */}
      <rect x={0} y={r3 + 10} width={14} height={14} rx={3} fill="none" stroke="var(--accent)" strokeWidth="1.5" />
      <text x={22} y={r3 + 22} fill="var(--muted)" fontSize="12.5">Fourgate, on your machine</text>
      <rect x={0} y={r3 + 36} width={14} height={14} rx={3} fill="none" stroke="var(--border-strong)" />
      <text x={22} y={r3 + 48} fill="var(--muted)" fontSize="12.5">Your existing systems</text>
    </svg>
  );
}

function wrap(text: string, max: number): string[] {
  const lines: string[] = [];
  let current = "";
  for (const word of text.split(" ")) {
    if (current && (current + " " + word).length > max) {
      lines.push(current);
      current = word;
    } else {
      current = current ? `${current} ${word}` : word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function Mobile({ labels, id, title }: { labels: FlowLabels; id: string; title: string }) {
  const steps: { n: Node; label?: string; accent?: boolean }[] = [
    { n: nodes.agent, label: labels.call },
    { n: nodes.guard, label: labels.forward },
    { n: nodes.server, label: labels.write },
    { n: nodes.sor, label: labels.readback, accent: true },
    { n: nodes.verifier, accent: true },
    { n: nodes.verdict, label: labels.record, accent: true },
    { n: nodes.log, label: labels.summarize, accent: true },
    { n: nodes.summary },
  ];
  const gap = 54;
  const x = 0;
  const height = steps.length * (H + gap) - gap + 4;
  const bw = 300;
  return (
    <svg viewBox={`-2 0 304 ${height}`} role="img" aria-labelledby={`${id}-m-title`} className="mx-auto block h-auto w-full max-w-sm md:hidden">
      <title id={`${id}-m-title`}>{title}</title>
      <Defs id={`${id}-m`} />
      {steps.map((s, i) => {
        const y = i * (H + gap);
        return (
          <g key={s.n.key}>
            <g transform={`translate(${(bw - W) / 2 - x} 0)`}>
              <Box n={s.n} x={0} y={y} />
            </g>
            {i < steps.length - 1 && (
              <>
                <path
                  d={i === 3 ? `M${bw / 2} ${y + H + gap - 4}V${y + H + 6}` : `M${bw / 2} ${y + H + 4}V${y + H + gap - 6}`}
                  stroke={s.accent ? "var(--accent)" : "var(--subtle)"}
                  strokeWidth={1.5}
                  strokeDasharray={i === 3 ? "6 5" : undefined}
                  // Step 3 is drawn bottom-up: the read-back GET goes from the verifier to the system of record.
                  markerEnd={`url(#${id}-m-${s.accent ? "arrow-accent" : "arrow"})`}
                />
                {s.label &&
                  wrap(s.label, 18).map((line, li, all) => (
                    <Label key={li} x={bw / 2 + 10} y={y + H + gap / 2 + 4 + (li - (all.length - 1) / 2) * 15} anchor="start">
                      {line}
                    </Label>
                  ))}
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export default function FlowDiagram({
  id = "flow",
  labels = defaultLabels,
  title = "Fourgate data flow: your agent calls your MCP server through fourgate guard; after a success result, a local verifier reads the system of record back with an independent read-only GET, records PASS, FAIL or UNKNOWN to a local outcomes.jsonl file, and fourgate summary turns that file into a local HTML page.",
}: {
  id?: string;
  labels?: FlowLabels;
  title?: string;
}) {
  return (
    <figure className="rounded-2xl border border-border bg-[#0c0f13] p-4 sm:p-8">
      <Desktop labels={labels} id={id} title={title} />
      <Mobile labels={labels} id={id} title={title} />
    </figure>
  );
}
