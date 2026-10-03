"use client";

import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { useId, useState, type ReactNode } from "react";
import type { Connector, DemoScene, Mode } from "@/content/demo";

const connectors: { value: Connector; label: string }[] = [
  { value: "broken", label: "Broken" },
  { value: "healthy", label: "Healthy" },
  { value: "outage", label: "Read-back outage" },
];
const modes: { value: Mode; label: string }[] = [
  { value: "without", label: "Without Fourgate" },
  { value: "shadow", label: "Shadow" },
  { value: "enforce", label: "Enforce" },
];
const NOT_RECORDED = "not part of the recorded demo";

const verdictStyle = {
  PASS: { cls: "text-pass border-pass/50", symbol: "✓" },
  FAIL: { cls: "text-fail border-fail/50", symbol: "✕" },
  UNKNOWN: { cls: "text-unknown border-unknown/50", symbol: "?" },
} as const;

/** "Label:   value" lines from the capture, split for display only. */
function splitLabel(line: string): [string | null, string] {
  const m = line.match(/^\s*(Agent receives(?:, first)?|then the original):\s+(.*)$/);
  return m ? [m[1], m[2]] : [null, line.trim()];
}

/** Color verdict words; the text itself is never changed. */
function Tokens({ text }: { text: string }) {
  const parts = text.split(/(\[FOURGATE\]|\bPASS\b|\bFAIL\b|\bUNKNOWN\b)/);
  return (
    <>
      {parts.map((p, i) =>
        p === "PASS" ? (
          <span key={i} className="text-pass">{p}</span>
        ) : p === "FAIL" ? (
          <span key={i} className="text-fail">{p}</span>
        ) : p === "UNKNOWN" ? (
          <span key={i} className="text-unknown">{p}</span>
        ) : p === "[FOURGATE]" ? (
          <span key={i} className="font-medium text-foreground underline decoration-foreground/40 underline-offset-2">{p}</span>
        ) : (
          p
        ),
      )}
    </>
  );
}

function Segmented<T extends string>({
  legend,
  name,
  options,
  value,
  isEnabled,
  onChange,
}: {
  legend: string;
  name: string;
  options: { value: T; label: string }[];
  value: T;
  isEnabled: (v: T) => boolean;
  onChange: (v: T) => void;
}) {
  const reasonId = useId();
  const reduce = useReducedMotion();
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-small text-muted">{legend}</legend>
      <LayoutGroup id={`seg-${name}`}>
      <div className="flex flex-wrap gap-1 rounded-[10px] border border-line bg-background p-1">
        {options.map((o) => {
          const enabled = isEnabled(o.value);
          const checked = value === o.value;
          return (
            <label
              key={o.value}
              className={`relative inline-flex min-h-9 items-center rounded-[7px] border px-3 text-small transition-colors ${
                checked
                  ? "border-transparent text-background"
                  : enabled
                    ? "cursor-pointer border-transparent text-foreground hover:bg-raised"
                    : "cursor-not-allowed border-dashed border-line-strong text-muted"
              } has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent`}
              title={enabled ? undefined : `${o.label}: ${NOT_RECORDED}`}
            >
              <input
                type="radio"
                name={name}
                value={o.value}
                checked={checked}
                disabled={!enabled}
                aria-describedby={enabled ? undefined : reasonId}
                onChange={() => onChange(o.value)}
                className="sr-only"
              />
              {checked && (
                <motion.span
                  layoutId="pill"
                  aria-hidden="true"
                  transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 520, damping: 38 }}
                  className="absolute inset-0 rounded-[7px] bg-foreground"
                />
              )}
              <span className="relative">{o.label}</span>
              {!enabled && <span className="sr-only"> (unavailable)</span>}
            </label>
          );
        })}
      </div>
      </LayoutGroup>
      <p id={reasonId} className="mt-2 min-h-[1.25rem] text-cap text-muted">
        {options.some((o) => !isEnabled(o.value))
          ? `Dashed options: ${NOT_RECORDED} with the selected ${name === "connector" ? "mode" : "connector"}.`
          : ""}
      </p>
    </fieldset>
  );
}

function Panel({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={`min-w-0 border-t border-line pt-3 ${className}`}>
      <h3 className="mb-2 text-small text-muted">{title}</h3>
      {children}
    </div>
  );
}

export default function VerdictSimulator({ scenes, preamble }: { scenes: DemoScene[]; preamble?: string }) {
  const [sceneId, setSceneId] = useState(scenes[1].id);
  const reduce = useReducedMotion();
  const scene = scenes.find((s) => s.id === sceneId)!;
  const find = (c: Connector, m: Mode) => scenes.find((s) => s.connector === c && s.mode === m);

  function pickConnector(c: Connector) {
    const s = find(c, scene.mode);
    if (s) setSceneId(s.id);
  }
  function pickMode(m: Mode) {
    const s = find(scene.connector, m);
    if (s) setSceneId(s.id);
  }

  const enter = reduce ? false : { opacity: 0, y: 6 };
  const shown = { opacity: 1, y: 0, transition: { duration: 0.22, ease: "easeOut" as const } };
  const exit = reduce ? undefined : { opacity: 0, transition: { duration: 0.1 } };
  const v = scene.verdict ? verdictStyle[scene.verdict] : null;

  return (
    <div className="rounded-[14px] border border-line bg-surface">
      <div className="grid gap-5 border-b border-line p-5 sm:p-6 lg:grid-cols-2">
        <Segmented
          legend="Connector"
          name="connector"
          options={connectors}
          value={scene.connector}
          isEnabled={(c) => Boolean(find(c, scene.mode))}
          onChange={pickConnector}
        />
        <Segmented
          legend="Mode"
          name="mode"
          options={modes}
          value={scene.mode}
          isEnabled={(m) => Boolean(find(scene.connector, m))}
          onChange={pickMode}
        />
        <div className="lg:col-span-2">
          <p className="mb-2 text-small text-muted">Or jump to a recorded scene</p>
          <div className="flex flex-wrap gap-1.5">
            {scenes.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSceneId(s.id)}
                aria-pressed={s.id === sceneId}
                className="min-h-9 rounded-[6px] border border-line px-2.5 font-mono text-cap text-muted hover:border-line-strong hover:text-foreground aria-pressed:border-foreground aria-pressed:text-foreground"
              >
                {s.code}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div aria-live="polite" className="sr-only">
        {`${scene.code}: ${scene.title}. ${scene.verdict ? `${scene.verdict} ${scene.reason}` : "No Fourgate check"}.`}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={scene.id} initial={enter} animate={shown} exit={exit} className="grid gap-6 p-5 sm:p-6 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-mono text-cap text-muted">{scene.code}</p>
            <p className="mt-1 text-foreground">{scene.title}</p>
            <motion.div
              initial={reduce ? false : { scale: 0.94, opacity: 0.4 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 22 }}
              className={`mt-5 flex min-h-32 flex-col justify-center rounded-[12px] border bg-background px-5 py-4 ${
                v ? v.cls : "border-dashed border-line-strong text-muted"
              }`}
            >
              <span className="font-display text-[2.5rem] leading-none sm:text-[3rem]">
                {v && (
                  <span aria-hidden="true" className="mr-2">
                    {v.symbol}
                  </span>
                )}
                {scene.verdict ?? "No check"}
              </span>
              <span className="mt-2 font-mono text-small text-muted">
                {scene.reason ?? "Fourgate is not in the path"}
              </span>
            </motion.div>
            <p className="mt-4 text-small text-foreground">{scene.conclusion}</p>
          </div>

          <div className="grid content-start gap-5 lg:col-span-8">
            <Panel title="What the agent receives">
              <ul className="space-y-1.5 font-mono text-[0.8125rem] leading-relaxed">
                {scene.agent.map((line) => {
                  const [label, value] = splitLabel(line);
                  return (
                    <li key={line} className="break-words text-foreground">
                      {label && <span className="mr-2 text-muted">{label}:</span>}
                      <Tokens text={value} />
                    </li>
                  );
                })}
              </ul>
            </Panel>
            <div className="grid gap-5 sm:grid-cols-2">
              <Panel title="System of record">
                <p className="font-mono text-[0.8125rem] text-foreground">{scene.systemOfRecord}</p>
              </Panel>
              <Panel title="Outcome log">
                <p className="font-mono text-[0.8125rem] text-foreground">
                  <Tokens text={scene.outcomeLog} />
                </p>
              </Panel>
            </div>
            <details className="group border-t border-line pt-3">
              <summary className="flex cursor-pointer items-center gap-2 text-small text-muted hover:text-foreground">
                <svg aria-hidden="true" viewBox="0 0 16 16" className="fg-chevron h-3.5 w-3.5">
                  <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.4" />
                </svg>
                Raw terminal output for {scene.code}
              </summary>
              <pre className="fg-scroll mt-3 overflow-x-auto rounded-[8px] border border-line bg-code p-4 font-mono text-[0.75rem] leading-[1.7] text-foreground">
                {preamble && (
                  <span className="block whitespace-pre-wrap text-muted lg:whitespace-pre">{`${preamble}\n\n`}</span>
                )}
                <span className="block whitespace-pre-wrap lg:whitespace-pre">{scene.output}</span>
              </pre>
            </details>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
