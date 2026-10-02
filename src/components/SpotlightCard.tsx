"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";

const MAX_TILT = 3; // degrees

/**
 * A card whose border lights up under the cursor and tilts up to 3 degrees.
 * Keyboard focus inside the card lights the border too (centered). No tilt or
 * lift with reduced motion. Pass `trail` for the featured plan's border trail.
 */
export default function SpotlightCard({
  children,
  className = "",
  trail = false,
  lift = false,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  trail?: boolean;
  /** Raise the card slightly while the pointer is over it. */
  lift?: boolean;
  as?: "div" | "li" | "section";
}) {
  const ref = useRef<HTMLElement | null>(null);

  function onMove(e: PointerEvent<HTMLElement>) {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.style.transform = `perspective(900px) ${lift ? "translateY(-3px) " : ""}rotateX(${((0.5 - py) * 2 * MAX_TILT).toFixed(2)}deg) rotateY(${((px - 0.5) * 2 * MAX_TILT).toFixed(2)}deg)`;
  }
  function onLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "";
    el.style.removeProperty("--mx");
    el.style.removeProperty("--my");
  }

  return (
    <Tag
      ref={(el: HTMLElement | null) => {
        ref.current = el;
      }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`fg-spot ${trail ? "fg-trail" : ""} transition-transform duration-200 ease-out will-change-transform ${className}`}
    >
      {children}
    </Tag>
  );
}
