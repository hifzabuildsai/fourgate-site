import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors min-h-11 text-center";
const variants: Record<Variant, string> = {
  primary: "bg-text text-bg hover:bg-white",
  secondary: "border border-border-strong bg-surface text-text hover:border-muted hover:bg-surface-2",
  ghost: "text-accent hover:underline underline-offset-4 px-1",
};

export function isExternal(href: string) {
  return /^(https?:|mailto:)/.test(href) || href.endsWith(".html");
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
  if (!href) return null;
  const cls = `${base} ${variants[variant]} ${className}`;
  if (isExternal(href)) {
    const newTab = href.startsWith("http");
    return (
      <a
        href={href}
        className={cls}
        {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
        {newTab && (
          <>
            <ExternalIcon />
            <span className="sr-only">(opens in a new tab)</span>
          </>
        )}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

export function ExternalIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0 opacity-70">
      <path
        d="M6 3h7v7M13 3 5.5 10.5M11 9.5V13H3V5h3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
