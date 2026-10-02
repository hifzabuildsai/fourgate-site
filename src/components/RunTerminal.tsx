"use client";

import { AnimatePresence, LayoutGroup, motion, useInView, useReducedMotion } from "motion/react";
import { useId, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";

export type OsCommands = { id: "linux" | "windows"; label: string; lines: string[] };

const noop = () => () => {};
/** Windows visitors see the PowerShell tab first; everyone else (and the prerender) sees bash. */
const detectOs = () => (/Windows/i.test(navigator.userAgent) ? "windows" : "linux");

async function writeClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  }
}

function CopyIcon({ done }: { done: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5">
      {done ? (
        <path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      ) : (
        <>
          <rect x="5" y="5" width="8.5" height="8.5" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
          <path d="M10.5 3.5V3A1.5 1.5 0 0 0 9 1.5H3.5A1.5 1.5 0 0 0 2 3v5.5A1.5 1.5 0 0 0 3.5 10H4" fill="none" stroke="currentColor" strokeWidth="1.3" />
        </>
      )}
    </svg>
  );
}

/**
 * One terminal card for "Run it yourself": an OS tab per shell (sliding pill),
 * three numbered commands, copy-all (without the "$" prompt) and per-line copy.
 * The commands reveal once when first scrolled into view (instant with reduced motion).
 */
export default function RunTerminal({ variants }: { variants: OsCommands[] }) {
  const detected = useSyncExternalStore(noop, detectOs, () => "linux" as const);
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  const [choice, setChoice] = useState<OsCommands["id"] | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const card = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const seen = useInView(card, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const uid = useId();

  const current = variants.find((v) => v.id === (choice ?? detected)) ?? variants[0];
  const hidden = hydrated && !seen && !reduce;

  async function copy(text: string, key: string) {
    await writeClipboard(text);
    setCopied(key);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(null), 1600);
  }

  function onKey(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft" && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    const n = variants.length;
    const next = e.key === "Home" ? 0 : e.key === "End" ? n - 1 : (i + (e.key === "ArrowRight" ? 1 : -1) + n) % n;
    setChoice(variants[next].id);
    tabs.current[next]?.focus();
  }

  return (
    <div ref={card} className="overflow-hidden rounded-[14px] border border-line bg-code">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-3 py-2">
        <LayoutGroup id={`${uid}-os`}>
          <div role="tablist" aria-label="Shell" className="inline-flex rounded-[10px] border border-line bg-background p-1">
            {variants.map((v, i) => {
              const on = v.id === current.id;
              return (
                <button
                  key={v.id}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  role="tab"
                  type="button"
                  id={`${uid}-tab-${v.id}`}
                  aria-selected={on}
                  aria-controls={`${uid}-panel`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => setChoice(v.id)}
                  onKeyDown={(e) => onKey(e, i)}
                  className={`relative min-h-8 rounded-[7px] px-3 text-cap font-medium transition-colors ${on ? "text-background" : "text-muted hover:text-foreground"}`}
                >
                  {on && (
                    <motion.span
                      layoutId="os-pill"
                      aria-hidden="true"
                      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 520, damping: 38 }}
                      className="absolute inset-0 rounded-[7px] bg-foreground"
                    />
                  )}
                  <span className="relative">{v.label}</span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>
        <button
          type="button"
          onClick={() => copy(current.lines.join("\n"), "all")}
          className={`inline-flex min-h-8 items-center gap-1.5 rounded-[6px] px-2.5 text-cap font-medium transition-colors ${
            copied === "all" ? "bg-foreground text-background" : "text-muted hover:bg-raised hover:text-foreground"
          }`}
        >
          <CopyIcon done={copied === "all"} />
          {copied === "all" ? "Copied" : "Copy all"}
          <span className="sr-only" aria-live="polite">
            {copied === "all" ? " to clipboard" : ""}
          </span>
        </button>
      </div>

      <div role="tabpanel" id={`${uid}-panel`} aria-labelledby={`${uid}-tab-${current.id}`}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.ol
            key={current.id}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: reduce ? 0 : 0.15 } }}
            exit={reduce ? undefined : { opacity: 0, transition: { duration: 0.08 } }}
            className="space-y-1 p-3 sm:p-4"
          >
            {current.lines.map((line, i) => (
              <motion.li
                key={line}
                initial={false}
                animate={hidden ? { opacity: 0, x: -8 } : { opacity: 1, x: 0 }}
                transition={reduce ? { duration: 0 } : { duration: 0.3, delay: hidden ? 0 : i * 0.18, ease: "easeOut" }}
                className="group flex items-start gap-3 rounded-[8px] px-2 py-1.5 hover:bg-raised focus-within:bg-raised"
              >
                <span
                  aria-hidden="true"
                  className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-line-strong font-mono text-[0.6875rem] text-muted"
                >
                  {i + 1}
                </span>
                <code className="min-w-0 flex-1 whitespace-pre-wrap break-all font-mono text-[0.8125rem] leading-relaxed text-foreground">
                  <span aria-hidden="true" className="select-none text-muted">
                    ${" "}
                  </span>
                  {line}
                </code>
                <button
                  type="button"
                  onClick={() => copy(line, `line-${i}`)}
                  aria-label={copied === `line-${i}` ? `Copied command ${i + 1}` : `Copy command ${i + 1}`}
                  className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] text-muted opacity-100 hover:bg-background hover:text-foreground focus-visible:opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
                >
                  <CopyIcon done={copied === `line-${i}`} />
                </button>
              </motion.li>
            ))}
          </motion.ol>
        </AnimatePresence>
      </div>
    </div>
  );
}
