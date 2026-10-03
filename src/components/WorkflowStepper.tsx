"use client";

import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import type { WorkflowStep } from "@/content/workflow";
import { useMediaQuery } from "@/lib/useMediaQuery";
import CodeBlock from "./CodeBlock";
import { hangStyle, noBreak } from "./hang";

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
      noBreak(p)
    ),
  );
}

/** Pause before a hovered step is selected, so a diagonal sweep toward the panel doesn't switch steps. */
const HOVER_INTENT_MS = 120;

/**
 * demo → init → doctor → scan → guard → summary, as an ARIA tablist in normal
 * page flow (two columns from lg, stacked below). Hover (mouse only, after a
 * short intent delay), click/tap, keyboard focus and arrow keys select a step;
 * leaving the list keeps the current one. The panel has a fixed height, so
 * nothing shifts between steps; long text scrolls inside it with an edge fade
 * and hands wheel scrolling back to the page at either end.
 */
export default function WorkflowStepper({ steps }: { steps: WorkflowStep[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const uid = useId();
  const reduce = useReducedMotion();
  const wide = useMediaQuery("(min-width: 1024px)");
  const step = steps[active];
  const panel = useRef<HTMLDivElement>(null);
  const [fade, setFade] = useState(false);
  const intent = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fade the panel's bottom edge while more text is below.
  const measure = useCallback(() => {
    const el = panel.current;
    setFade(Boolean(el) && el!.scrollHeight - el!.clientHeight - el!.scrollTop > 2);
  }, []);
  useEffect(() => {
    const el = panel.current;
    if (!el) return;
    el.scrollTop = 0;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    measure();
    return () => ro.disconnect();
  }, [active, measure]);
  useEffect(() => () => {
    if (intent.current) clearTimeout(intent.current);
  }, []);

  const pending = useRef(-1);
  function hover(i: number) {
    if (pending.current === i) return;
    cancelHover();
    pending.current = i;
    intent.current = setTimeout(() => {
      pending.current = -1;
      setActive(i);
    }, HOVER_INTENT_MS);
  }
  function cancelHover() {
    pending.current = -1;
    if (intent.current) clearTimeout(intent.current);
  }

  function select(i: number) {
    cancelHover();
    setActive(i);
  }

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
    select(next);
    refs.current[next]?.focus();
  }

  const progress = `${(active / (steps.length - 1)) * 100}%`;
  const ease = reduce ? { duration: 0 } : { duration: 0.3, ease: [0.2, 0.7, 0.2, 1] as const };

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <div className="relative min-w-0 lg:col-span-4 lg:self-start">
        {/* Rail: fills to the selected step. */}
        <span aria-hidden="true" className="absolute bottom-5 left-[1.375rem] top-5 hidden w-px bg-line lg:block">
          <motion.span className="absolute inset-x-0 top-0 bg-foreground" initial={false} animate={{ height: progress }} transition={ease} />
        </span>
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-line lg:hidden">
          <motion.span className="absolute inset-y-0 left-0 bg-foreground" initial={false} animate={{ width: progress }} transition={ease} />
        </span>
        <LayoutGroup id={`${uid}-steps`}>
          <div
            role="tablist"
            aria-label="Fourgate workflow"
            aria-orientation={wide ? "vertical" : "horizontal"}
            className="fg-scroll -mx-4 flex gap-1 overflow-x-auto px-4 pb-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0"
          >
            {steps.map((s, i) => {
              const on = i === active;
              return (
                <button
                  key={s.id}
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  role="tab"
                  type="button"
                  id={`${uid}-tab-${s.id}`}
                  aria-selected={on}
                  aria-controls={`${uid}-panel`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => select(i)}
                  onFocus={() => select(i)}
                  onPointerMove={(e) => {
                    // Real mouse movement only: a step sliding under a resting pointer must not override the keyboard.
                    if (e.pointerType === "mouse" && i !== active) hover(i);
                  }}
                  onPointerLeave={cancelHover}
                  onKeyDown={onKey}
                  className="group relative flex shrink-0 items-baseline gap-3 rounded-[10px] px-3 py-2.5 text-left lg:shrink"
                >
                  {on && (
                    <motion.span
                      layoutId="active-step"
                      aria-hidden="true"
                      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 480, damping: 40 }}
                      className="absolute inset-0 rounded-[10px] border border-line-strong bg-surface"
                    />
                  )}
                  <span
                    className={`relative z-[1] inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border font-mono text-[0.6875rem] transition-colors ${
                      i <= active ? "border-foreground bg-foreground text-background" : "border-line-strong bg-background text-muted"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="relative">
                    <span className={`font-mono text-small ${on ? "text-foreground" : "text-muted group-hover:text-foreground"}`}>
                      fourgate {s.name}
                    </span>
                    <span className="hidden text-cap text-muted lg:block">{s.purpose}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>
      </div>

      <div
        role="tabpanel"
        id={`${uid}-panel`}
        aria-labelledby={`${uid}-tab-${step.id}`}
        ref={panel}
        tabIndex={0}
        onScroll={measure}
        style={fade ? { maskImage: "linear-gradient(to bottom, #000 calc(100% - 2.5rem), transparent)" } : undefined}
        className="fg-scroll relative h-[34rem] min-w-0 overflow-y-auto overscroll-auto lg:col-span-8"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step.id}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.22, ease: "easeOut" } }}
            exit={reduce ? undefined : { opacity: 0, y: -6, transition: { duration: 0.12 } }}
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
                  aria-label={`Output of fourgate ${step.name}`}
                  className="bg-code p-4 font-mono text-[0.75rem] leading-[1.7] text-foreground"
                >
                  {step.output.split("\n").map((line, i) => (
                    <span key={i} className="block min-h-[1lh] whitespace-pre-wrap [overflow-wrap:anywhere]" style={hangStyle(line)}>
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
