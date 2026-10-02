"use client";

import { useRef, useState } from "react";

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

  return (
    <div className={`overflow-hidden rounded-[10px] border border-line bg-[#0a0d12] ${className}`}>
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-1.5">
        <span className="truncate text-cap text-muted">{label ?? "Shell"}</span>
        <button
          type="button"
          onClick={copy}
          className="min-h-8 rounded-[4px] px-2 text-cap font-medium text-muted hover:bg-surface hover:text-bone"
        >
          {copied ? "Copied" : "Copy"}
          <span className="sr-only" aria-live="polite">
            {copied ? " to clipboard" : ""}
          </span>
        </button>
      </div>
      <pre
        className="fg-scroll overflow-auto p-4 font-mono text-[0.8125rem] leading-relaxed text-bone"
        style={maxHeight ? { maxHeight } : undefined}
      >
        <code>
          {code.split("\n").map((line, i) => (
            <span key={i} className="block min-h-[1lh] whitespace-pre-wrap break-words">
              {prompt && line && !line.startsWith("#") && !line.startsWith(" ") && (
                <span aria-hidden="true" className="select-none text-muted">
                  ${" "}
                </span>
              )}
              <span className={line.startsWith("#") ? "text-muted" : undefined}>{line}</span>
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
