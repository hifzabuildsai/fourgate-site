"use client";

import Link from "next/link";
import { useRef, type PointerEvent, type ReactNode } from "react";
import { externalProps, isExternal } from "@/lib/links";

type Variant = "primary" | "secondary" | "text";

const base =
  "inline-flex min-h-11 items-center justify-center rounded-[8px] px-4 text-small font-medium text-center transition-[background-color,border-color,color,transform] duration-200 ease-out";
const variants: Record<Variant, string> = {
  primary: "fg-sweep bg-foreground text-background hover:bg-foreground/85",
  secondary: "fg-sweep border border-line-strong bg-background text-foreground hover:border-foreground/40 hover:bg-surface",
  text: "min-h-0 px-0 link",
};

const MAX = 3; // px of magnetic pull

function useMagnet() {
  const ref = useRef<HTMLAnchorElement>(null);
  return {
    ref,
    onPointerMove(e: PointerEvent<HTMLAnchorElement>) {
      const el = ref.current;
      if (!el || e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const r = el.getBoundingClientRect();
      const dx = ((e.clientX - r.left) / r.width - 0.5) * 2 * MAX;
      const dy = ((e.clientY - r.top) / r.height - 0.5) * 2 * MAX;
      el.style.transform = `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px)`;
    },
    onPointerLeave() {
      if (ref.current) ref.current.style.transform = "";
    },
  };
}

/** Renders nothing when href is empty, so CTAs backed by unset config simply disappear. */
export default function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  const magnet = useMagnet();
  if (!href) return null;
  const cls = `${base} ${variants[variant]} ${className}`;
  const handlers = variant === "text" ? {} : magnet;
  if (/^(https?:|mailto:)/.test(href) || href.endsWith(".html")) {
    return (
      <a href={href} className={cls} {...externalProps(href)} {...handlers}>
        {children}
        {isExternal(href) && <span className="sr-only"> (opens in a new tab)</span>}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...handlers}>
      {children}
    </Link>
  );
}
