"use client";

import { useState } from "react";
import SpotlightCard from "./SpotlightCard";

type Node = "agent" | "guard" | "server" | "sor";
type Edge = "call" | "forward" | "write" | "readback";
type Segment = { nodes: Node[]; edges: Edge[] };

export type Integration = {
  title: string;
  text: string;
  /** Type chips. "Template" only where the card's own copy says template / not yet run. */
  chips: ("Runtime" | "Read-back" | "Verifier" | "CI" | "Template")[];
  segment: Segment;
};

const NODES: { id: Node; title: string; sub: string }[] = [
  { id: "agent", title: "Your agent", sub: "MCP client" },
  { id: "guard", title: "fourgate guard", sub: "local process" },
  { id: "server", title: "Your MCP server", sub: "no code changes" },
  { id: "sor", title: "System of record", sub: "the API you write to" },
];
const EDGE_LABEL: Record<Exclude<Edge, "readback">, string> = { call: "tools/call", forward: "unchanged", write: "its own write" };
const FORWARD: Exclude<Edge, "readback">[] = ["call", "forward", "write"];

function Chip({ label }: { label: string }) {
  return (
    <span
      className={`rounded-full px-2 py-px font-mono text-[0.6875rem] ${
        label === "Template" ? "border border-dashed border-line-strong text-muted" : "border border-line-strong text-foreground"
      }`}
    >
      {label}
    </span>
  );
}

/**
 * The call path with the read-back returning to the guard, plus the integration
 * cards. Hovering or focusing a card lights the part of the path it covers.
 */
export default function IntegrationsFlow({ items }: { items: Integration[] }) {
  const [active, setActive] = useState<number | null>(null);
  const seg = active === null ? null : items[active].segment;
  const nodeOn = (n: Node) => !seg || seg.nodes.includes(n);
  const edgeOn = (e: Edge) => !seg || seg.edges.includes(e);
  const lit = (on: boolean) => (seg ? (on ? "opacity-100" : "opacity-30") : "opacity-100");

  return (
    <div>
      <figure aria-label="Where each integration sits in the call path" className="mb-6 rounded-[16px] border border-line bg-surface p-4 sm:p-5">
        <ol className="grid gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] sm:items-center">
          {NODES.map((n, i) => (
            <li key={n.id} className="contents">
              <div
                className={`rounded-[10px] border bg-background px-3 py-2 text-center transition-opacity duration-200 ${lit(nodeOn(n.id))} ${
                  seg && nodeOn(n.id) ? "border-foreground" : "border-line-strong"
                }`}
              >
                <p className="text-small font-medium text-foreground">{n.title}</p>
                <p className="text-cap text-muted">{n.sub}</p>
              </div>
              {i < FORWARD.length && (
                <div
                  aria-hidden="true"
                  className={`flex items-center justify-center gap-1 font-mono text-[0.6875rem] text-muted transition-opacity duration-200 sm:flex-col ${lit(edgeOn(FORWARD[i]))}`}
                >
                  <span>{EDGE_LABEL[FORWARD[i]]}</span>
                  <span className={edgeOn(FORWARD[i]) && seg ? "text-foreground" : ""}>
                    <span className="sm:hidden">↓</span>
                    <span className="hidden sm:inline">→</span>
                  </span>
                </div>
              )}
            </li>
          ))}
        </ol>
        <div
          className={`mt-3 flex items-center gap-2 font-mono text-[0.6875rem] transition-opacity duration-200 ${lit(edgeOn("readback"))} ${
            seg && edgeOn("readback") ? "text-foreground" : "text-muted"
          }`}
        >
          <span aria-hidden="true" className={`h-px flex-1 border-t border-dashed ${seg && edgeOn("readback") ? "border-foreground" : "border-line-strong"}`} />
          <span>
            <span aria-hidden="true">← </span>independent read-only GET, back to fourgate guard
          </span>
          <span aria-hidden="true" className={`h-px flex-1 border-t border-dashed ${seg && edgeOn("readback") ? "border-foreground" : "border-line-strong"}`} />
        </div>
      </figure>

      <ul className="grid gap-3 md:grid-cols-2" onMouseLeave={() => setActive(null)}>
        {items.map((t, i) => (
          <SpotlightCard
            as="li"
            key={t.title}
            className={`rounded-[14px] border border-line bg-surface ${i === 0 ? "md:col-span-2" : ""}`}
          >
            <div
              tabIndex={0}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className="h-full rounded-[14px] p-5 outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <h2 className="font-medium text-foreground">{t.title}</h2>
                <span className="flex flex-wrap gap-1.5">
                  {t.chips.map((c) => (
                    <Chip key={c} label={c} />
                  ))}
                </span>
              </div>
              <p className="mt-1.5 text-small text-muted">{t.text}</p>
            </div>
          </SpotlightCard>
        ))}
      </ul>
    </div>
  );
}
