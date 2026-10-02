import Link from "next/link";
import type { ReactNode } from "react";
import { externalProps, isExternal } from "@/lib/links";

type Variant = "primary" | "secondary" | "text";

const base =
  "inline-flex min-h-11 items-center justify-center rounded-[6px] px-4 text-small font-medium text-center transition-colors";
const variants: Record<Variant, string> = {
  primary: "bg-bone text-night hover:bg-white",
  secondary: "border border-line text-bone hover:border-muted hover:bg-surface",
  text: "min-h-0 px-0 text-bone underline decoration-bone/40 underline-offset-4 hover:decoration-bone",
};

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
  if (!href) return null;
  const cls = `${base} ${variants[variant]} ${className}`;
  if (/^(https?:|mailto:)/.test(href) || href.endsWith(".html")) {
    return (
      <a href={href} className={cls} {...externalProps(href)}>
        {children}
        {isExternal(href) && <span className="sr-only"> (opens in a new tab)</span>}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
