"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/useMediaQuery";
import StaticGates from "./StaticGates";
import { GATE_LABELS, GATE_TIPS } from "./gates";

// three.js only loads on the client, once the scene is on screen and the browser is idle.
const GateScene = dynamic(() => import("./GateScene"), { ssr: false });

const noop = () => () => {};
function detectWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}
let webglCache: boolean | null = null;
const hasWebGL = () => (webglCache ??= detectWebGL());

/** Visible gate names under the scene when the scene itself only shows numbers. */
function Legend() {
  return (
    <ol aria-hidden="true" className="absolute inset-x-0 bottom-0 z-[2] grid grid-cols-2 gap-x-4 gap-y-1 px-4 pb-4 text-cap text-muted sm:px-8">
      {GATE_LABELS.map((l, i) => (
        <li key={l}>
          <span className="mr-1.5 font-mono text-foreground">{i + 1}</span>
          {l}
        </li>
      ))}
    </ol>
  );
}

export default function HeroScene() {
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  const webgl = useSyncExternalStore(noop, hasWebGL, () => false);
  const reduced = usePrefersReducedMotion();
  const small = useMediaQuery("(max-width: 767px)");
  const overlay = useMediaQuery("(min-width: 1280px)");
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "light" ? "light" : "dark";
  const wrap = useRef<HTMLDivElement>(null);
  const labels = useRef<(HTMLElement | null)[]>([]);
  const highlight = useRef<number | null>(null);
  const [tip, setTip] = useState<number | null>(null);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [armed, setArmed] = useState(false);
  const uid = useId();

  useEffect(() => {
    if (!inView || armed) return;
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setArmed(true), { timeout: 1500 });
      return () => w.cancelIdleCallback?.(id);
    }
    const t = setTimeout(() => setArmed(true), 300);
    return () => clearTimeout(t);
  }, [inView, armed]);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    const onVis = () => setPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const mode = !hydrated ? "pending" : reduced || !webgl ? "static" : "live";
  const show = (i: number | null) => {
    highlight.current = i;
    setTip(i);
  };

  return (
    <div ref={wrap} className="absolute inset-0">
      {mode === "live" && armed && (
        <>
          <GateScene labels={labels} highlight={highlight} active={inView && pageVisible} small={small} overlay={overlay} theme={theme} />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_72%,var(--background))]" />
        </>
      )}
      {mode === "static" && (
        <div className={`absolute inset-0 flex items-center justify-center px-4 ${overlay ? "pl-[46%] pr-8" : "pb-14 pt-4"}`}>
          <StaticGates numbersOnly={!overlay} />
        </div>
      )}
      {mode !== "pending" && !overlay && <Legend />}

      {/* The gates as text. Over the 3D scene each label is a button: hover or focus it to light up that gate
          and read what is checked there. Otherwise the list is read by assistive tech only. */}
      <ol aria-label="The four gates" className={mode === "live" ? "pointer-events-none absolute inset-0" : "sr-only"}>
        {GATE_LABELS.map((label, i) => (
          <li
            key={label}
            ref={(el) => {
              labels.current[i] = el;
            }}
            className={mode === "live" ? "absolute left-0 top-0 opacity-0 will-change-transform" : undefined}
          >
            {mode === "live" ? (
              <span className="relative block">
                <button
                  type="button"
                  aria-describedby={`${uid}-tip-${i}`}
                  onMouseEnter={() => show(i)}
                  onMouseLeave={() => show(null)}
                  onFocus={() => show(i)}
                  onBlur={() => show(null)}
                  onClick={() => show(tip === i ? null : i)}
                  className={`pointer-events-auto whitespace-nowrap rounded-full border px-2.5 py-1 text-cap shadow-sm backdrop-blur ${
                    tip === i ? "border-foreground/50 bg-background text-foreground" : "border-line bg-background/80 text-foreground"
                  }`}
                >
                  <span className="font-mono text-muted">{i + 1}</span>
                  <span className={overlay ? "ml-1.5" : "sr-only"}> {label}</span>
                </button>
                <span
                  id={`${uid}-tip-${i}`}
                  role="tooltip"
                  className={`pointer-events-none absolute left-1/2 z-10 w-64 -translate-x-1/2 rounded-[10px] border border-line bg-background p-3 text-left text-cap leading-relaxed text-muted shadow-lg transition-opacity duration-150 ${
                    // Labels above a gate open upward and labels below open downward, so the gate stays visible.
                    i % 2 === 0 ? "bottom-full mb-2" : "top-full mt-2"
                  } ${
                    tip === i ? "opacity-100" : "sr-only opacity-0"
                  }`}
                >
                  <span className="mb-1 block font-medium text-foreground">{label}</span>
                  {GATE_TIPS[i]}
                </span>
              </span>
            ) : (
              <>
                {i + 1}. {label}: {GATE_TIPS[i]}
              </>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
