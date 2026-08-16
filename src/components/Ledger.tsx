"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const LEDGER_ROWS = [
  { status: "pass", check: "stdout_cleanliness", target: "checking raw stdout for non-JSON lines..." },
  { status: "fail", check: "stdout_cleanliness", target: "stray print() found on line 14" },
  { status: "pass", check: "tool_call:valid", target: "add_numbers(a=1, b=1) → completed" },
  { status: "pass", check: "tool_call:malformed", target: "add_numbers(a='x', b=1) → clean error" },
  { status: "pass", check: "tool_call:edge_case", target: "divide(a=1, b=0) → clean error" },
  { status: "pass", check: "handshake", target: "initialize → valid JSON-RPC response" },
  { status: "pass", check: "tools_list", target: "3 tool(s) discovered" },
  { status: "fail", check: "crash_recovery", target: "process did not survive malformed call" },
] as const;

const ROW_HEIGHT = 37;

export function Ledger() {
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let raf: number;
    const step = () => {
      posRef.current += 0.6;
      if (posRef.current > LEDGER_ROWS.length * ROW_HEIGHT) posRef.current = 0;
      if (trackRef.current) {
        trackRef.current.style.transform = `translateY(-${posRef.current}px)`;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const repeated = [...LEDGER_ROWS, ...LEDGER_ROWS, ...LEDGER_ROWS];

  return (
    <motion.section
      className="pt-14 pb-2"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
    >
      <div className="flex items-baseline justify-between mb-4 flex-wrap gap-2">
        <div className="font-mono text-[0.75rem] text-gold uppercase tracking-[0.1em]">
          What a check actually does
        </div>
        <div className="font-mono text-[0.72rem] text-muted-2">
          illustrative — cycles through the real check types, not live usage data
        </div>
      </div>
      <div className="relative h-[220px] rounded-[10px] border border-border bg-surface overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(180deg, var(--color-surface) 0%, transparent 12%, transparent 88%, var(--color-surface) 100%)",
          }}
        />
        <div ref={trackRef} className="flex flex-col">
          {repeated.map((r, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-[18px] py-[9px] font-mono text-[0.78rem] border-b border-border-soft text-muted transition-colors hover:bg-surface-2"
            >
              <span className={`w-[52px] shrink-0 font-bold ${r.status === "pass" ? "text-pass" : "text-fail"}`}>
                {r.status === "pass" ? "✔ PASS" : "✘ FAIL"}
              </span>
              <span className="text-text shrink-0">[{r.check}]</span>
              <span className="text-muted overflow-hidden text-ellipsis whitespace-nowrap">{r.target}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
