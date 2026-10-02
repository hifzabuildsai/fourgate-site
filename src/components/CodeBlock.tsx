"use client";

import { useRef, useState } from "react";

/** Code/command block with a copy button. Copies the code exactly as shown. */
export default function CodeBlock({
  code,
  label,
  prompt = false,
  className = "",
}: {
  code: string;
  label?: string;
  /** Show a "$" before each line (visual only; not copied). */
  prompt?: boolean;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    timer.current = setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className={`overflow-hidden rounded-xl border border-border bg-[#07090b] ${className}`}>
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2">
        <span className="truncate font-mono text-xs text-subtle">{label ?? "shell"}</span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex min-h-8 items-center gap-1.5 rounded-md border border-border px-2.5 text-xs font-medium text-muted hover:border-border-strong hover:text-text"
        >
          {copied ? (
            <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5 text-pass">
              <path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          ) : (
            <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5">
              <rect x="5" y="5" width="8.5" height="8.5" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
              <path d="M10.5 3.5V3A1.5 1.5 0 0 0 9 1.5H3.5A1.5 1.5 0 0 0 2 3v5.5A1.5 1.5 0 0 0 3.5 10H4" fill="none" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          )}
          <span>{copied ? "Copied" : "Copy"}</span>
          <span className="sr-only" aria-live="polite">
            {copied ? "Copied to clipboard" : ""}
          </span>
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[0.8125rem] leading-relaxed text-text">
        <code>
          {code.split("\n").map((line, i) => (
            <span key={i} className="block whitespace-pre-wrap break-words">
              {prompt && line && !line.startsWith("#") && (
                <span aria-hidden="true" className="select-none text-subtle">
                  ${" "}
                </span>
              )}
              <span className={line.startsWith("#") ? "text-subtle" : undefined}>{line}</span>
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
