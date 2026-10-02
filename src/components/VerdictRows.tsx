import type { ReactNode } from "react";

export type VerdictKind = "pass" | "fail" | "unknown";

const color: Record<VerdictKind, string> = { pass: "var(--pass)", fail: "var(--fail)", unknown: "var(--unknown)" };
const text: Record<VerdictKind, string> = { pass: "text-pass", fail: "text-fail", unknown: "text-unknown" };
const bar: Record<VerdictKind, string> = { pass: "bg-pass", fail: "bg-fail", unknown: "bg-unknown" };

/**
 * Four bars (the gates) and a dot (a call). When its row is hovered or focused the
 * dot runs once: PASS crosses all four, FAIL drops at bar 3, UNKNOWN stops at bar 3.
 */
export function GateIcon({ kind }: { kind: VerdictKind }) {
  return (
    <svg viewBox="0 0 40 18" className="h-[18px] w-10 shrink-0 overflow-visible" aria-hidden="true">
      {[8, 16, 24, 32].map((x) => (
        <rect key={x} x={x} y="1" width="2" height="14" rx="1" fill="var(--line-strong)" />
      ))}
      <circle className="fg-gate-dot" data-kind={kind} cx="2" cy="8" r="2.4" fill={color[kind]} />
    </svg>
  );
}

/** A verdict row; focusable so keyboard users get the same animation as hover. */
export function VerdictRow({
  kind,
  word,
  children,
  size = "row",
}: {
  kind: VerdictKind;
  word: string;
  children: ReactNode;
  size?: "row" | "legend";
}) {
  const big = size === "row";
  return (
    <div
      tabIndex={0}
      className={`group relative grid items-start gap-x-4 gap-y-1 outline-none focus-visible:ring-2 focus-visible:ring-accent ${
        big ? "rounded-[10px] py-6 pl-5 sm:grid-cols-[15rem_1fr] sm:gap-x-8" : "rounded-[8px] py-1.5 pl-4 grid-cols-[8.5rem_1fr]"
      }`}
    >
      <span
        aria-hidden="true"
        className={`absolute left-0 top-1/2 w-[3px] -translate-y-1/2 rounded-full ${bar[kind]} h-3 transition-[height] duration-300 ease-out group-hover:h-[calc(100%-1rem)] group-focus-visible:h-[calc(100%-1rem)] motion-reduce:transition-none`}
      />
      <span className={`flex items-center gap-3 ${big ? "font-display text-h4" : "font-mono text-small"} ${text[kind]}`}>
        <GateIcon kind={kind} />
        {word}
      </span>
      <span className={big ? "max-w-[60ch] text-muted" : "text-small text-muted"}>{children}</span>
    </div>
  );
}
