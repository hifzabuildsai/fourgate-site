"use client";

import { useTheme } from "next-themes";
import { useId, useSyncExternalStore } from "react";

const noop = () => () => {};

/**
 * Light/dark switch. The icon is drawn from CSS (the `dark` class on <html>),
 * so it is correct on first paint; the sun's rays fold away and a bite
 * slides in to make the moon. Until the visitor clicks, the system theme applies.
 */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const maskId = `fg-moon-${useId().replace(/:/g, "")}`;
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const isDark = mounted && resolvedTheme === "dark";
  const label = mounted ? `Switch to ${isDark ? "light" : "dark"} theme` : "Toggle theme";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={label}
      title={label}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-line text-foreground hover:bg-raised ${className}`}
    >
      <svg viewBox="0 0 24 24" className="fg-theme-icon h-[18px] w-[18px]" aria-hidden="true">
        <mask id={maskId}>
          <rect width="24" height="24" fill="white" />
          <circle className="moon-cut" cx="27" cy="-3" r="7" fill="black" />
        </mask>
        <circle className="sun-core" cx="12" cy="12" r="4.5" fill="currentColor" mask={`url(#${maskId})`} />
        <g className="sun-rays" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
          <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
        </g>
      </svg>
    </button>
  );
}
