"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useState, type ReactNode } from "react";
import StatusBadge from "./StatusBadge";
import {
  readbacks,
  reported,
  withReadback,
  withoutReadback,
  type ReadbackId,
  type ReportedId,
  type Result,
} from "@/content/verdict-explorer";

function RadioGroup<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
  disabled = false,
  note,
}: {
  legend: ReactNode;
  name: string;
  options: { id: T; label: string; hint: string }[];
  value: T;
  onChange: (v: T) => void;
  disabled?: boolean;
  note?: string;
}) {
  return (
    <fieldset disabled={disabled} className={`min-w-0 ${disabled ? "opacity-60" : ""}`}>
      <legend className="mb-2 text-small font-medium text-foreground">{legend}</legend>
      <div className="space-y-1.5">
        {options.map((o) => (
          <label
            key={o.id}
            className={`relative block rounded-[10px] border px-3 py-2 text-small has-[:checked]:border-foreground has-[:checked]:bg-raised has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent ${
              disabled ? "border-line" : "cursor-pointer border-line hover:border-line-strong"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={o.id}
              checked={value === o.id}
              onChange={() => onChange(o.id)}
              className="sr-only"
            />
            <span className="block font-medium text-foreground">{o.label}</span>
            <span className="mt-0.5 block text-cap text-muted">{o.hint}</span>
          </label>
        ))}
      </div>
      {note && <p className="mt-2 text-cap text-muted">{note}</p>}
    </fieldset>
  );
}

const borderFor = { PASS: "border-pass/60", FAIL: "border-fail/60", UNKNOWN: "border-unknown/60" } as const;

/**
 * Pick what the tool reported and what the read-back returned; see the verdict the
 * v0.3.0 documentation gives for that combination. Only documented combinations are offered.
 */
export default function VerdictExplorer() {
  const uid = useId();
  const reduce = useReducedMotion();
  const [rep, setRep] = useState<ReportedId>("success-id");
  const [rb, setRb] = useState<ReadbackId>("match");

  const readbackUsed = rep === "success-id";
  const result: Result = readbackUsed ? withReadback[rb] : withoutReadback[rep];
  const key = readbackUsed ? `rb-${rb}` : rep;

  return (
    <figure className="my-8 rounded-[14px] border border-line p-4 sm:p-6">
      <figcaption className="mb-5 text-cap text-muted">
        Interactive. Choose what the tool reported and what the read-back returned. Only combinations the documentation covers are offered.
      </figcaption>
      <div className="grid gap-6 md:grid-cols-2">
        <RadioGroup
          legend="1. What the tool reported"
          name={`${uid}-reported`}
          options={reported}
          value={rep}
          onChange={setRep}
        />
        <RadioGroup
          legend="2. What the read-back returned"
          name={`${uid}-readback`}
          options={readbacks}
          value={rb}
          onChange={setRb}
          disabled={!readbackUsed}
          note={readbackUsed ? undefined : "Not used: with this result, Fourgate does not run a read-back."}
        />
      </div>

      <div className="mt-6" role="status" aria-live="polite" aria-atomic="true">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={key}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.18 } }}
            exit={reduce ? undefined : { opacity: 0, y: -4, transition: { duration: 0.1 } }}
            className={`rounded-[10px] border-2 bg-surface p-4 ${borderFor[result.verdict]}`}
          >
            <p className="flex flex-wrap items-center gap-3">
              <span className="text-cap text-muted">Verdict</span>
              <StatusBadge status={result.verdict} />
              <code className="code-inline">{result.reason}</code>
            </p>
            <p className="mt-2 text-small text-foreground">{result.why}</p>
            <p className="mt-2 text-cap text-muted">
              {result.verdict === "PASS"
                ? "fourgate scan exit code: 0 when every case is PASS."
                : result.verdict === "FAIL"
                  ? "fourgate scan exit code: 1 (any FAIL or UNKNOWN)."
                  : "fourgate scan exit code: 1 (any FAIL or UNKNOWN). UNKNOWN is never counted as PASS."}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
      <p className="mt-4 text-cap text-muted">
        Reason codes are the ones in a scan report. Under <code className="code-inline">fourgate guard</code>, a verifier that fails
        or times out is recorded as <code className="code-inline">verifier_error</code> or{" "}
        <code className="code-inline">verifier_timeout</code>, and the call goes through untouched.
      </p>
    </figure>
  );
}
