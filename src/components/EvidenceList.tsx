"use client";

import CountUp from "./CountUp";
import { revealStyle, useReveal } from "./Reveal";

export type Evidence = { value: string; text: string };

/** 3 of 4: three filled pips, one empty (neutral colors; red/green/amber are reserved for verdicts). */
function Pips() {
  return (
    <span aria-hidden="true" className="mt-2 flex gap-1">
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className={`h-2 w-4 rounded-full border ${i < 3 ? "border-foreground bg-foreground" : "border-line-strong"}`} />
      ))}
    </span>
  );
}

function CheckChip() {
  return (
    <span aria-hidden="true" className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full border border-line-strong align-middle text-foreground">
      <svg viewBox="0 0 16 16" className="h-3 w-3">
        <path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </span>
  );
}

/**
 * Field evidence rows. Numbers and sentences are passed in unchanged; this only adds
 * presentation: count-up for "4" and "3 of 4", pips for 3 of 4, a check chip on
 * "Exercised", and an outlined, hatched "not observed yet" treatment for the 0
 * (which never animates).
 */
function Row({ e, i }: { e: Evidence; i: number }) {
  const ref = useReveal<HTMLDivElement>();
  const none = e.value === "0";
  return (
    <div
      ref={ref}
      style={revealStyle(i, 0.06)}
      className={`fg-reveal grid gap-1 rounded-[12px] px-4 py-4 sm:grid-cols-[10rem_1fr] sm:gap-8 ${
        none
          ? "border border-dashed border-line-strong bg-[repeating-linear-gradient(135deg,transparent_0_7px,color-mix(in_srgb,var(--foreground)_5%,transparent)_7px_8px)]"
          : "border border-transparent hover:border-line hover:bg-surface"
      }`}
    >
      <dt className="font-display text-h3 text-foreground">
        {none ? e.value : <CountUp value={e.value} />}
        {e.value === "Exercised" && <CheckChip />}
        {e.value === "3 of 4" && <Pips />}
        {none && (
          <span className="ml-2 inline-block rounded-full border border-dashed border-line-strong px-2 py-0.5 align-middle font-mono text-[0.6875rem] font-normal tracking-normal text-muted">
            not observed yet
          </span>
        )}
      </dt>
      <dd className="max-w-[62ch] text-small text-muted">{e.text}</dd>
    </div>
  );
}

export default function EvidenceList({ items }: { items: Evidence[] }) {
  return (
    <dl className="space-y-1.5">
      {items.map((e, i) => (
        <Row key={e.text} e={e} i={i} />
      ))}
    </dl>
  );
}
