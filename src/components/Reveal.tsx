"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * Entrance state is CSS-only and applies under `.js` (set on <html> by an inline
 * head script), so the static HTML is fully visible without JavaScript and for
 * crawlers. Once hydrated, an observer marks each element `data-in` the first
 * time it nears the viewport. Reduced motion shows everything immediately.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.setAttribute("data-in", "");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.setAttribute("data-in", "");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

export function revealStyle(index: number, step = 0.07): CSSProperties {
  return { "--rv-delay": `${index * step}s` } as CSSProperties;
}

/** One-time staggered entrance when first scrolled into view. None with reduced motion. */
export default function Reveal({
  children,
  index = 0,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  index?: number;
  className?: string;
  as?: "div" | "li";
}) {
  const ref = useReveal<HTMLElement>();
  const Tag = as;
  return (
    <Tag ref={ref as never} className={`fg-reveal ${className}`} style={revealStyle(index)}>
      {children}
    </Tag>
  );
}
