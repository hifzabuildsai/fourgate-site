"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import { hangStyle, noBreak } from "./hang";

/** Command/code block with a copy button. Copies exactly the code shown. */
export default function CodeBlock({
  code,
  label,
  prompt = false,
  className = "",
  maxHeight,
}: {
  code: string;
  label?: string;
  /** Show "$" before each command line (visual only; not copied). */
  prompt?: boolean;
  className?: string;
  maxHeight?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduce = useReducedMotion();

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = code;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  }

  const t = reduce ? { duration: 0 } : { duration: 0.16 };

  return (
    <div className={`overflow-hidden rounded-[10px] border border-line bg-code ${className}`}>
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-1.5">
        <span className="truncate text-cap text-muted">{label ?? "Shell"}</span>
        <motion.button
          type="button"
          onClick={copy}
          layout={!reduce}
          transition={t}
          className={`inline-flex min-h-8 items-center gap-1.5 overflow-hidden rounded-[6px] px-2 text-cap font-medium ${
            copied ? "bg-foreground text-background" : "text-muted hover:bg-raised hover:text-foreground"
          }`}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={copied ? "done" : "copy"}
              initial={reduce ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0, transition: t }}
              exit={reduce ? undefined : { opacity: 0, y: -4, transition: { duration: 0.1 } }}
              className="inline-flex items-center gap-1.5"
            >
              <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5">
                {copied ? (
                  <path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                ) : (
                  <>
                    <rect x="5" y="5" width="8.5" height="8.5" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
                    <path d="M10.5 3.5V3A1.5 1.5 0 0 0 9 1.5H3.5A1.5 1.5 0 0 0 2 3v5.5A1.5 1.5 0 0 0 3.5 10H4" fill="none" stroke="currentColor" strokeWidth="1.3" />
                  </>
                )}
              </svg>
              {copied ? "Copied" : "Copy"}
            </motion.span>
          </AnimatePresence>
          <span className="sr-only" aria-live="polite">
            {copied ? " to clipboard" : ""}
          </span>
        </motion.button>
      </div>
      <pre
        className="fg-scroll overflow-auto p-4 font-mono text-[0.8125rem] leading-relaxed text-foreground"
        style={maxHeight ? { maxHeight } : undefined}
      >
        <code>
          {code.split("\n").map((line, i) => (
            <span key={i} className="block min-h-[1lh] whitespace-pre-wrap [overflow-wrap:anywhere]" style={hangStyle(line)}>
              {prompt && line && !line.startsWith("#") && !line.startsWith(" ") && (
                <span aria-hidden="true" className="select-none text-muted">
                  ${" "}
                </span>
              )}
              <span className={line.startsWith("#") ? "text-muted" : undefined}>{noBreak(line)}</span>
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
