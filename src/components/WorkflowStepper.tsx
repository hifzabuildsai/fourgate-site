"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
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
  const reduce = useReducedMotion();
  const progress = `${(active / (steps.length - 1)) * 100}%`;
  const ease = reduce ? { duration: 0 } : { duration: 0.35, ease: [0.2, 0.7, 0.2, 1] as const };

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
      <div className="relative min-w-0 lg:col-span-4">
      {/* Progress rail: fills up to the selected step (vertical on wide screens, horizontal on phones). */}
      <span aria-hidden="true" className="absolute bottom-5 left-[1.375rem] top-5 hidden w-px bg-line lg:block">
        <motion.span className="absolute inset-x-0 top-0 bg-foreground" initial={false} animate={{ height: progress }} transition={ease} />
      </span>
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-line lg:hidden">
        <motion.span className="absolute inset-y-0 left-0 bg-foreground" initial={false} animate={{ width: progress }} transition={ease} />
      </span>
      <div
        role="tablist"
        aria-label="Fourgate workflow"
        className="fg-scroll -mx-4 flex gap-1 overflow-x-auto px-4 pb-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0"
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
            className={`group relative flex shrink-0 items-baseline gap-3 rounded-[10px] border px-3 py-2.5 text-left transition-colors lg:shrink ${
              i === active ? "border-line-strong bg-surface" : "border-transparent hover:bg-surface"
            }`}
          >
            <span
              className={`relative z-[1] inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border font-mono text-[0.6875rem] transition-colors ${
                i <= active ? "border-foreground bg-foreground text-background" : "border-line-strong bg-background text-muted"
              }`}
            >
              {i + 1}
            </span>
            <span>
              <span className={`font-mono text-small ${i === active ? "text-foreground" : "text-muted group-hover:text-foreground"}`}>
                fourgate {s.name}
              </span>
              <span className="hidden text-cap text-muted lg:block">{s.purpose}</span>
            </span>
          </button>
        ))}
      </div>
      </div>

      <div role="tabpanel" id={`${uid}-panel`} aria-labelledby={`${uid}-tab-${step.id}`} className="min-w-0 lg:col-span-8">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step.id}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: reduce ? 0 : 0.2 } }}
            exit={reduce ? undefined : { opacity: 0, transition: { duration: 0.12 } }}
            className="space-y-4"
          >
        <p className="text-foreground lg:hidden">{step.purpose}</p>
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
              className="fg-scroll max-h-[26rem] overflow-auto bg-code p-4 font-mono text-[0.75rem] leading-[1.7] text-foreground"
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
            <blockquote className="max-w-[68ch] text-small text-foreground">{step.readme}</blockquote>
          </figure>
        )}

        {step.link && (
          <a href={step.link.href} className="inline-block text-small link">
            {step.link.label}
          </a>
        )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
