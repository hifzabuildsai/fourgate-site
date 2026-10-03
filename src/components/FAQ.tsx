"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useState, type ReactNode } from "react";

export type FaqItem = { q: string; a: ReactNode };

function Item({ item, open, onToggle }: { item: FaqItem; open: boolean; onToggle: () => void }) {
  const reduce = useReducedMotion();
  const id = useId();
  return (
    <div className="border-t border-line">
      <h3>
        <button
          type="button"
          id={`${id}-button`}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={onToggle}
          className="flex w-full items-start justify-between gap-6 py-5 text-left text-lead text-foreground hover:text-muted"
        >
          <span>{item.q}</span>
          <motion.svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="mt-1.5 h-4 w-4 shrink-0 text-muted"
            initial={false}
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: reduce ? 0 : 0.2 }}
          >
            <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.4" />
          </motion.svg>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${id}-panel`}
            role="region"
            aria-labelledby={`${id}-button`}
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1, transition: { duration: reduce ? 0 : 0.26, ease: [0.2, 0.7, 0.2, 1] } }}
            exit={reduce ? undefined : { height: 0, opacity: 0, transition: { duration: 0.2 } }}
            className="overflow-hidden"
          >
            <div className="prose-fg pb-6 text-muted">{item.a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Exclusive accordion: opening a question closes the one that was open, and
 * clicking the open question closes it (all closed is allowed). Each question is
 * a button with aria-expanded / aria-controls; the answer animates its height.
 */
export default function FAQ({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="border-b border-line">
      {items.map((item, i) => (
        <Item key={item.q} item={item} open={open === i} onToggle={() => setOpen((cur) => (cur === i ? null : i))} />
      ))}
    </div>
  );
}
