"use client";

import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export type Group = { title: string; items: ReactNode[] };

/**
 * Groups of rules as tabs (sliding pill, arrow keys). Every panel is rendered;
 * inactive ones are `hidden`, so all text stays in the page. The shown panel
 * fades in; rows highlight on hover. Instant with reduced motion.
 */
export default function TabbedGroups({ groups, label }: { groups: Group[]; label: string }) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const uid = useId();

  function onKey(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    const n = groups.length;
    const map: Record<string, number> = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: n - 1 };
    if (!(e.key in map)) return;
    e.preventDefault();
    const next = (map[e.key] + n) % n;
    setActive(next);
    tabs.current[next]?.focus();
  }

  return (
    <div>
      <LayoutGroup id={`${uid}-groups`}>
        <div
          role="tablist"
          aria-label={label}
          className="fg-scroll -mx-4 flex overflow-x-auto px-4 sm:mx-0 sm:inline-flex sm:px-0"
        >
          <div className="inline-flex shrink-0 rounded-[12px] border border-line bg-surface p-1">
            {groups.map((g, i) => {
              const on = i === active;
              return (
                <button
                  key={g.title}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  role="tab"
                  type="button"
                  id={`${uid}-tab-${i}`}
                  aria-selected={on}
                  aria-controls={`${uid}-panel-${i}`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => onKey(e, i)}
                  className={`relative min-h-9 whitespace-nowrap rounded-[9px] px-3.5 text-small font-medium transition-colors ${
                    on ? "text-background" : "text-muted hover:text-foreground"
                  }`}
                >
                  {on && (
                    <motion.span
                      layoutId="group-pill"
                      aria-hidden="true"
                      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 520, damping: 40 }}
                      className="absolute inset-0 rounded-[9px] bg-foreground"
                    />
                  )}
                  <span className="relative">{g.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </LayoutGroup>

      {groups.map((g, i) => {
        const on = i === active;
        return (
          <div key={g.title} role="tabpanel" id={`${uid}-panel-${i}`} aria-labelledby={`${uid}-tab-${i}`} hidden={!on} className="mt-6">
            <motion.ul
              key={on ? `on-${i}` : `off-${i}`}
              initial={on && !reduce ? { opacity: 0, y: 8 } : false}
              animate={{ opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.25, ease: "easeOut" } }}
              className="max-w-3xl space-y-1"
            >
              {g.items.map((it, j) => (
                <li
                  key={j}
                  className="rounded-[10px] border border-transparent px-4 py-3 text-muted transition-colors hover:border-line hover:bg-surface"
                >
                  {it}
                </li>
              ))}
            </motion.ul>
          </div>
        );
      })}
    </div>
  );
}
