import type { ReactNode } from "react";
import Reveal from "./Reveal";
import SpotlightCard from "./SpotlightCard";

export type Reason = { title: string; text: string };

/*
  Small decorative visuals for "Built to be checked, not trusted." Each one only
  restates the card's own claim (aria-hidden; the card text carries the meaning).
  Verdict colors appear only on the UNKNOWN card, where the verdict is the point.
*/

function MachineVisual() {
  // Laptop, server and CI runner; the cloud is struck through.
  return (
    <svg viewBox="0 0 220 64" className="h-16 w-full max-w-[220px]" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4">
      <g className="text-foreground">
        <rect x="6" y="18" width="34" height="22" rx="2" />
        <path d="M1 44h44" strokeLinecap="round" />
        <rect x="62" y="12" width="30" height="36" rx="3" />
        <path d="M68 22h18M68 30h18M68 38h18" />
        <rect x="110" y="18" width="34" height="26" rx="3" />
        <path d="m118 27 5 4-5 4M127 36h8" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="text-muted">
        <path d="M172 40h30a9 9 0 0 0-2-17.8A12 12 0 0 0 177 26a7 7 0 0 0-5 14Z" strokeDasharray="3 3" />
        <path d="m166 50 44-36" strokeWidth="1.8" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function DiffVisual() {
  return (
    <div aria-hidden="true" className="overflow-hidden rounded-[8px] border border-line bg-code font-mono text-[0.6875rem] leading-[1.7]">
      <p className="truncate px-3 text-muted">
        <span className="mr-2 select-none">-</span>python your_server.py
      </p>
      <p className="truncate bg-foreground/[0.06] px-3 text-foreground">
        <span className="mr-2 select-none">+</span>fourgate guard … -- python your_server.py
      </p>
    </div>
  );
}

function GetVisual() {
  // Verifier sends a GET; the record comes back.
  return (
    <svg viewBox="0 0 220 56" className="h-14 w-full max-w-[220px]" aria-hidden="true" fill="none">
      <rect x="2" y="12" width="56" height="32" rx="6" className="stroke-muted" strokeWidth="1.3" />
      <text x="30" y="32" textAnchor="middle" className="fill-muted" fontSize="10" fontFamily="var(--font-geist-mono)">verifier</text>
      <path d="M64 22h86" className="stroke-foreground" strokeWidth="1.4" markerEnd="url(#bento-get)" />
      <text x="106" y="16" textAnchor="middle" className="fill-foreground" fontSize="10" fontFamily="var(--font-geist-mono)">GET</text>
      <path d="M150 36H66" className="stroke-muted" strokeWidth="1.4" strokeDasharray="4 3" markerEnd="url(#bento-back)" />
      <rect x="158" y="10" width="58" height="36" rx="6" className="stroke-foreground" strokeWidth="1.3" />
      <path d="M168 20h38M168 28h28M168 36h33" className="stroke-muted" strokeWidth="1.3" strokeLinecap="round" />
      <defs>
        <marker id="bento-get" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0 10 5 0 10z" className="fill-foreground" />
        </marker>
        <marker id="bento-back" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0 10 5 0 10z" className="fill-muted" />
        </marker>
      </defs>
    </svg>
  );
}

function BytesVisual() {
  // The same byte pattern twice: with and without Fourgate.
  const bytes = [3, 1, 4, 1, 5, 2, 6, 5, 3, 5, 2, 4];
  const row = (y: number) =>
    bytes.map((b, i) => <rect key={`${y}-${i}`} x={i * 15} y={y} width="11" height={6 + b * 2} rx="1.5" className="fill-foreground/70" />);
  return (
    <div aria-hidden="true" className="flex items-center gap-3">
      <svg viewBox="0 0 180 58" className="h-14 w-full max-w-[180px]">
        {row(0)}
        {row(30)}
      </svg>
      <span className="shrink-0 rounded-full border border-line-strong px-2 py-0.5 font-mono text-[0.6875rem] text-muted">= same bytes</span>
    </div>
  );
}

function UnknownVisual() {
  // A call times out at the read-back: it resolves to UNKNOWN, never to PASS.
  return (
    <div aria-hidden="true" className="space-y-4">
      <svg viewBox="0 0 360 64" className="h-auto w-full max-w-[420px]" fill="none">
        <rect x="2" y="20" width="72" height="26" rx="6" className="stroke-line-strong" strokeWidth="1.3" />
        <text x="38" y="37" textAnchor="middle" className="fill-muted" fontSize="11" fontFamily="var(--font-geist-mono)">tool call</text>
        <path d="M80 33h70" className="stroke-muted" strokeWidth="1.4" strokeDasharray="4 4" />
        <circle cx="178" cy="33" r="18" className="stroke-muted" strokeWidth="1.4" />
        <path d="M178 22v11l7 6" className="stroke-muted" strokeWidth="1.6" strokeLinecap="round" />
        <text x="178" y="64" textAnchor="middle" className="fill-muted" fontSize="10" fontFamily="var(--font-geist-mono)">2000 ms</text>
        <path d="M200 33h50" className="stroke-unknown" strokeWidth="1.6" />
        <rect x="256" y="18" width="102" height="30" rx="8" className="stroke-unknown" strokeWidth="1.5" />
        <text x="307" y="38" textAnchor="middle" className="fill-unknown" fontSize="13" fontWeight="600" fontFamily="var(--font-geist-mono)">? UNKNOWN</text>
      </svg>
      <p className="flex items-center gap-2 font-mono text-[0.75rem] text-muted">
        <span className="rounded-[6px] border border-dashed border-line-strong px-2 py-0.5 line-through">PASS</span>
        <span>never</span>
      </p>
    </div>
  );
}

function SourceVisual() {
  return (
    <div aria-hidden="true" className="space-y-1 font-mono text-[0.6875rem] leading-relaxed text-muted">
      <p>
        <span className="rounded-[4px] border border-line-strong px-1.5 py-px text-foreground">MIT</span>{" "}
        <span className="rounded-[4px] border border-line-strong px-1.5 py-px">v0.3.0</span>
      </p>
      <p className="truncate">sha256:0f5d48f9ea93…99efefd3b</p>
    </div>
  );
}

const visuals: Record<string, () => ReactNode> = {
  "Runs on your machine": MachineVisual,
  "No code changes": DiffVisual,
  "Any HTTP API read-back": GetVisual,
  "Shadow first, byte-identical": BytesVisual,
  "UNKNOWN is never PASS": UnknownVisual,
  "Open source": SourceVisual,
};

// Grid placement on wide screens; DOM order stays the original reading order.
const placement: Record<string, string> = {
  "Runs on your machine": "lg:col-start-3 lg:row-start-1",
  "No code changes": "lg:col-start-3 lg:row-start-2",
  "Any HTTP API read-back": "lg:col-start-1 lg:row-start-3",
  "Shadow first, byte-identical": "lg:col-start-2 lg:row-start-3",
  "UNKNOWN is never PASS": "lg:col-span-2 lg:col-start-1 lg:row-span-2 lg:row-start-1",
  "Open source": "lg:col-start-3 lg:row-start-3",
};

/** "Built to be checked, not trusted." as a bento grid; the UNKNOWN card is the largest. */
export default function WhyBento({ reasons }: { reasons: Reason[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {reasons.map((r, i) => {
        const Visual = visuals[r.title];
        const big = r.title === "UNKNOWN is never PASS";
        return (
          <Reveal as="li" key={r.title} index={i} className={`${placement[r.title] ?? ""} ${big ? "sm:col-span-2" : ""}`}>
            <SpotlightCard lift className={`flex h-full flex-col rounded-[16px] border border-line bg-surface ${big ? "p-6 sm:p-8" : "p-5"}`}>
              <div className={big ? "mb-8 flex flex-1 items-center" : "mb-5"}>{Visual && <Visual />}</div>
              <h3 className={`font-medium text-foreground ${big ? "text-h4" : ""}`}>{r.title}</h3>
              <p className={`mt-1.5 text-muted ${big ? "max-w-[46ch]" : "text-small"}`}>{r.text}</p>
            </SpotlightCard>
          </Reveal>
        );
      })}
    </ul>
  );
}
