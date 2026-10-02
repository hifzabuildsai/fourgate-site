"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import type { WorkflowStep } from "@/content/workflow";
import CodeBlock from "./CodeBlock";

function colorize(line: string) {
  // Verdict words in captured output; text unchanged.
  const parts = line.split(/(\bPASS\b|\bFAIL\b|\bUNKNOWN\b)/);
  return parts.map((p, i) =>
    p === "PASS" ? (
      <span key={i} className="text-pass">{p}</span>
    ) : p === "FAIL" ? (
      <span key={i} className="text-fail">{p}</span>
    ) : p === "UNKNOWN" ? (
      <span key={i} className="text-unknown">{p}</span>
    ) : (
      p
    ),
  );
}

/** demo → init → doctor → scan → guard → summary, as an ARIA tablist. */
export default function WorkflowStepper({ steps }: { steps: WorkflowStep[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const uid = useId();
  const step = steps[active];

  function onKey(e: KeyboardEvent<HTMLButtonElement>) {
    const keys: Record<string, number> = {
      ArrowDown: active + 1,
      ArrowRight: active + 1,
      ArrowUp: active - 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: steps.length - 1,
    };
    if (!(e.key in keys)) return;
    e.preventDefault();
    const next = (keys[e.key] + steps.length) % steps.length;
    setActive(next);
    refs.current[next]?.focus();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <div
        role="tablist"
        aria-label="Fourgate workflow"
        className="fg-scroll -mx-4 flex gap-1 overflow-x-auto px-4 pb-1 lg:col-span-4 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0"
      >
        {steps.map((s, i) => (
          <button
            key={s.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            type="button"
            id={`${uid}-tab-${s.id}`}
            aria-selected={i === active}
            aria-controls={`${uid}-panel`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={onKey}
            className={`group flex shrink-0 items-baseline gap-3 rounded-[8px] border px-3 py-2.5 text-left lg:shrink ${
              i === active ? "border-bone/70 bg-surface" : "border-transparent hover:border-line"
            }`}
          >
            <span className="font-mono text-cap text-muted">{i + 1}</span>
            <span>
              <span className={`font-mono text-small ${i === active ? "text-bone" : "text-muted group-hover:text-bone"}`}>
                fourgate {s.name}
              </span>
              <span className="hidden text-cap text-muted lg:block">{s.purpose}</span>
            </span>
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`${uid}-panel`}
        aria-labelledby={`${uid}-tab-${step.id}`}
        className="min-w-0 space-y-4 lg:col-span-8"
      >
        <p className="text-bone lg:hidden">{step.purpose}</p>
        <CodeBlock code={step.command} label="Command" prompt />
        {step.commandNote && <p className="text-cap text-muted">{step.commandNote}</p>}

        {step.output && (
          <div className="overflow-hidden rounded-[10px] border border-line">
            <div className="flex items-center justify-between gap-3 border-b border-line bg-surface px-4 py-1.5">
              <span className="text-cap text-muted">Real output</span>
              {step.outputNote && <span className="truncate text-cap text-muted">{step.outputNote}</span>}
            </div>
            <pre
              tabIndex={0}
              aria-label={`Output of fourgate ${step.name}`}
              className="fg-scroll max-h-[26rem] overflow-auto bg-[#0a0d12] p-4 font-mono text-[0.75rem] leading-[1.7] text-bone"
            >
              {step.output.split("\n").map((line, i) => (
                <span key={i} className="block min-h-[1lh] whitespace-pre-wrap break-words lg:whitespace-pre">
                  {colorize(line)}
                </span>
              ))}
            </pre>
          </div>
        )}

        {step.readme && (
          <figure className="rounded-[10px] border border-line p-4 sm:p-5">
            <figcaption className="mb-2 text-cap text-muted">From the README (no captured output on this site)</figcaption>
            <blockquote className="max-w-[68ch] text-small text-bone">{step.readme}</blockquote>
          </figure>
        )}

        {step.link && (
          <a href={step.link.href} className="inline-block text-small text-bone underline decoration-bone/40 underline-offset-4 hover:decoration-bone">
            {step.link.label}
          </a>
        )}
      </div>
    </div>
  );
}
