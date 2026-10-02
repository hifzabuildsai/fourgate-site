"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/useMediaQuery";
import StaticGates from "./StaticGates";
import { GATE_LABELS } from "./gates";

// three.js only loads on the client, after the hero text has rendered.
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
          <span className="mr-1.5 font-mono text-bone">{i + 1}</span>
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
  const wrap = useRef<HTMLDivElement>(null);
  const labels = useRef<(HTMLElement | null)[]>([]);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  // three.js is only fetched once the scene is on screen and the browser is idle,
  // so it never competes with the hero text (or loads at all if nobody scrolls to it).
  const [armed, setArmed] = useState(false);

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

  return (
    <div ref={wrap} className="absolute inset-0">
      {mode === "live" && armed && (
        <>
          <GateScene labels={labels} active={inView && pageVisible} small={small} overlay={overlay} />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_72%,var(--night))]" />
        </>
      )}
      {mode === "static" && (
        <div className={`absolute inset-0 flex items-center justify-center px-4 ${overlay ? "pl-[46%] pr-8" : "pb-14 pt-4"}`}>
          <StaticGates numbersOnly={!overlay} />
        </div>
      )}
      {mode !== "pending" && !overlay && <Legend />}

      {/* The gates as text: positioned over the 3D gates when the scene runs, otherwise read by assistive tech only. */}
      <ol aria-label="The four gates" className={mode === "live" ? "pointer-events-none absolute inset-0" : "sr-only"}>
        {GATE_LABELS.map((label, i) => (
          <li
            key={label}
            ref={(el) => {
              labels.current[i] = el;
            }}
            className={
              mode === "live"
                ? "absolute left-0 top-0 whitespace-nowrap rounded-[4px] border border-line bg-night/85 px-2 py-0.5 text-cap text-bone opacity-0 will-change-transform"
                : undefined
            }
          >
            <span className="font-mono text-muted">{i + 1}</span>
            <span className={overlay ? "ml-1.5" : "sr-only"}> {label}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
