"use client";

import { AnimatePresence, LayoutGroup, motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import type { WorkflowStep } from "@/content/workflow";
import { useMediaQuery } from "@/lib/useMediaQuery";
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

/** Scroll distance per step while the stage is pinned (desktop, motion allowed). */
const VH_PER_STEP = 60;

/**
 * demo → init → doctor → scan → guard → summary, as an ARIA tablist.
 *
 * Desktop (lg+, motion allowed): a tall wrapper holds a sticky stage; scrolling
 * through it selects steps (about 60vh each) and fills the rail. Hover, focus,
 * click and arrow keys select immediately. The most recent input wins: scroll
 * only moves the selection again when its own step index changes, so it never
 * fights a hover. Below lg or with reduced motion: no pinning; hover, tap and
 * arrow keys select.
 */
export default function WorkflowStepper({ steps }: { steps: WorkflowStep[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const wrapper = useRef<HTMLDivElement>(null);
  const lastScrollIndex = useRef(0);
  const uid = useId();
  const reduce = useReducedMotion();
  const wide = useMediaQuery("(min-width: 1024px)");
  const pinned = wide && !reduce;
  const step = steps[active];

  const { scrollYProgress } = useScroll({ target: wrapper, offset: ["start 72px", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!pinned) return;
    const index = Math.min(steps.length - 1, Math.max(0, Math.floor(v * steps.length)));
    if (index !== lastScrollIndex.current) {
      lastScrollIndex.current = index;
      setActive(index);
    }
  });

  function select(i: number) {
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

  const stage = (
    <div className={`grid gap-6 lg:grid-cols-12 ${pinned ? "h-full content-start" : ""}`}>
      <div className="relative min-w-0 lg:col-span-4 lg:self-start">
        {/* Rail: on the pinned desktop stage it fills with scroll; otherwise it fills to the selected step. */}
        <span aria-hidden="true" className="absolute bottom-5 left-[1.375rem] top-5 hidden w-px bg-line lg:block">
          {pinned ? (
            <motion.span className="absolute inset-0 origin-top bg-foreground" style={{ scaleY: scrollYProgress }} />
          ) : (
            <motion.span className="absolute inset-x-0 top-0 bg-foreground" initial={false} animate={{ height: progress }} transition={ease} />
          )}
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
                  onPointerEnter={(e) => {
                    if (e.pointerType === "mouse") select(i);
                  }}
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
        className={`relative min-w-0 lg:col-span-8 ${pinned ? "" : "min-h-[40rem]"}`}
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
                  tabIndex={0}
                  aria-label={`Output of fourgate ${step.name}`}
                  className={`fg-scroll overflow-auto bg-code p-4 font-mono text-[0.75rem] leading-[1.7] text-foreground ${
                    pinned ? "max-h-[max(14rem,calc(100vh-26rem))]" : "max-h-[26rem]"
                  }`}
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

  return (
    <div
      ref={wrapper}
      data-pinned={pinned ? "true" : "false"}
      className="relative"
      style={pinned ? { height: `calc(${steps.length * VH_PER_STEP}vh + 100vh - 8rem)` } : undefined}
    >
      {pinned ? <div className="sticky top-[4.5rem] h-[calc(100vh-6rem)]">{stage}</div> : stage}
    </div>
  );
}
