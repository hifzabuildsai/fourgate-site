"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import StatusBadge from "./StatusBadge";

export type TerminalTab = {
  id: string;
  label: string;
  verdict?: "PASS" | "FAIL" | "UNKNOWN" | null;
  caption?: string;
  output: string;
};

const TOKEN =
  /(\[FOURGATE\]|\bPASS\b|\bFAIL\b|\bUNKNOWN\b|\boutcome_failed\b|\brecord_missing\b|\bpostcondition_satisfied\b|\bverifier_error\b)/;

const tokenClass: Record<string, string> = {
  PASS: "text-pass font-semibold",
  postcondition_satisfied: "text-pass",
  FAIL: "text-fail font-semibold",
  outcome_failed: "text-fail",
  record_missing: "text-fail",
  UNKNOWN: "text-unknown font-semibold",
  verifier_error: "text-unknown",
  "[FOURGATE]": "text-accent font-semibold",
};

/** Color known verdict tokens. The text itself is never changed. */
function renderLine(line: string, index: number): ReactNode {
  const parts = line.split(TOKEN);
  const isHeader = /^\[\d\/5\] /.test(line);
  const isConclusion = /^\s*->/.test(line);
  return (
    <span
      key={index}
      className={`block min-h-[1lh] whitespace-pre-wrap break-words lg:whitespace-pre ${
        isHeader ? "font-semibold text-text" : isConclusion ? "text-text" : "text-muted"
      }`}
    >
      {parts.map((p, i) =>
        tokenClass[p] ? (
          <span key={i} className={tokenClass[p]}>
            {p}
          </span>
        ) : (
          p
        ),
      )}
    </span>
  );
}

/** Tabbed terminal following the WAI-ARIA tabs pattern (arrow keys, Home, End). */
export default function Terminal({
  tabs,
  title = "fourgate demo",
  footer,
}: {
  tabs: TerminalTab[];
  title?: string;
  footer?: ReactNode;
}) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const uid = useId();

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    let next = active;
    if (e.key === "ArrowRight") next = (active + 1) % tabs.length;
    else if (e.key === "ArrowLeft") next = (active - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    else return;
    e.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
  }

  const tab = tabs[active];

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-[#07090b] shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]">
      <div className="flex items-center gap-3 border-b border-border bg-surface px-4 py-2.5">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
          <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
          <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
        </span>
        <span className="truncate font-mono text-xs text-subtle">{title}</span>
      </div>

      <div
        role="tablist"
        aria-label="Demo scenes"
        className="flex gap-1 overflow-x-auto border-b border-border bg-surface/60 px-2 py-2"
      >
        {tabs.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            type="button"
            id={`${uid}-tab-${t.id}`}
            aria-selected={i === active}
            aria-controls={`${uid}-panel`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={onKeyDown}
            className={`inline-flex min-h-9 shrink-0 items-center gap-2 rounded-md px-3 font-mono text-xs whitespace-nowrap ${
              i === active
                ? "bg-surface-2 text-text ring-1 ring-border-strong"
                : "text-subtle hover:bg-surface-2 hover:text-text"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`${uid}-panel`}
        aria-labelledby={`${uid}-tab-${tab.id}`}
        tabIndex={0}
        className="focus-visible:outline-offset-[-2px]"
      >
        {tab.caption && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-border/70 px-4 py-3 sm:px-5">
            {tab.verdict ? (
              <StatusBadge status={tab.verdict} size="sm" />
            ) : (
              <span className="inline-flex items-center rounded-md border border-border-strong px-2 py-0.5 font-mono text-[0.7rem] font-semibold text-subtle">
                NO CHECK
              </span>
            )}
            <p className="min-w-0 flex-1 text-sm text-muted">{tab.caption}</p>
          </div>
        )}
        <pre key={tab.id} className="fg-fade-in overflow-x-auto p-4 font-mono text-[0.75rem] leading-[1.7] sm:p-5 sm:text-[0.8125rem]">
          <code>{tab.output.split("\n").map(renderLine)}</code>
        </pre>
      </div>
      {footer && <div className="border-t border-border px-4 py-3 text-xs text-subtle sm:px-5">{footer}</div>}
    </div>
  );
}
