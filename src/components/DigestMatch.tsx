"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

// Placeholder digests: "placeholder" is spelled into them (and z/y are not hex), so they
// can never be mistaken for a real release digest.
const LEFT = "0123";
const RIGHT = "3210";
const MIDDLE = "…placeholder…";

/**
 * Illustration only: the digest GitHub lists and the digest you compute line up, and the
 * check is that every character matches. Animates once when first in view; static with
 * reduced motion.
 */
export default function DigestMatch() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const aligned = reduce || seen;

  const row = (label: string, offset: number) => (
    <div className="grid grid-cols-[7.5rem_1fr] items-center gap-3">
      <span className="text-cap text-muted">{label}</span>
      <motion.code
        initial={false}
        animate={{ x: aligned ? 0 : offset, opacity: aligned ? 1 : 0.5 }}
        transition={{ duration: reduce ? 0 : 0.6, ease: [0.2, 0.7, 0.2, 1] }}
        className="truncate font-mono text-[0.75rem] text-foreground"
      >
        sha256:{LEFT}
        <span className="text-muted">{MIDDLE}</span>
        {RIGHT}zy
      </motion.code>
    </div>
  );

  return (
    <figure ref={ref} className="rounded-[14px] border border-dashed border-line-strong p-4">
      <figcaption className="mb-3 flex flex-wrap items-center justify-between gap-2 text-cap text-muted">
        <span>Illustration with placeholder digests</span>
        <motion.span
          initial={false}
          animate={{ opacity: aligned ? 1 : 0 }}
          transition={{ duration: reduce ? 0 : 0.3, delay: reduce ? 0 : 0.6 }}
          className="rounded-full border border-line-strong px-2 py-px font-mono text-foreground"
        >
          = match
        </motion.span>
      </figcaption>
      <div aria-hidden="true" className="space-y-2">
        {row("release page", 0)}
        {row("your download", 28)}
      </div>
    </figure>
  );
}
