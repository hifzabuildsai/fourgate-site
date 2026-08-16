"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

type Level = "PASS" | "FAIL" | "WARN" | "INFO";
type ReportLine = { level: Level; text: string };
type Report = {
  server: string;
  lines: ReportLine[];
  summary: string;
  result: string;
  resultOk: boolean;
};

const REPORTS: Record<"broken" | "clean", Report> = {
  broken: {
    server: "fixtures/broken_server.py",
    lines: [
      { level: "INFO", text: "ℹ [tools_list] Discovered 3 tool(s): ['add_numbers', 'get_greeting', 'divide']" },
      { level: "FAIL", text: "✘ [stdout_cleanliness] Non-JSON output on stdout broke the JSON-RPC stream: 'DEBUG: adding 1 + 1'" },
      { level: "PASS", text: "✔ [tool_call:add_numbers:valid] Call completed normally." },
      { level: "PASS", text: "✔ [tool_call:add_numbers:malformed] Call completed normally." },
      { level: "FAIL", text: "✘ [stdout_cleanliness] Non-JSON output on stdout broke the JSON-RPC stream: 'DEBUG: adding 0 + 0'" },
      { level: "PASS", text: "✔ [tool_call:add_numbers:edge_case] Call completed normally." },
      { level: "PASS", text: "✔ [tool_call:get_greeting:valid] Call completed normally." },
      { level: "PASS", text: "✔ [tool_call:get_greeting:malformed] Call completed normally." },
      { level: "PASS", text: "✔ [tool_call:divide:valid] Call completed normally." },
      { level: "PASS", text: "✔ [tool_call:divide:malformed] Call completed normally." },
      { level: "PASS", text: "✔ [tool_call:divide:edge_case] Call completed normally." },
    ],
    summary: "8 passed, 2 failed, 0 warnings",
    result: "RESULT: NOT SAFE TO SHIP — fix the failures above first.",
    resultOk: false,
  },
  clean: {
    server: "fixtures/clean_server.py",
    lines: [
      { level: "INFO", text: "ℹ [tools_list] Discovered 3 tool(s): ['add_numbers', 'get_greeting', 'divide']" },
      { level: "PASS", text: "✔ [tool_call:add_numbers:valid] Call completed normally." },
      { level: "PASS", text: "✔ [tool_call:add_numbers:malformed] Call completed normally." },
      { level: "PASS", text: "✔ [tool_call:add_numbers:edge_case] Call completed normally." },
      { level: "PASS", text: "✔ [tool_call:get_greeting:valid] Call completed normally." },
      { level: "PASS", text: "✔ [tool_call:get_greeting:malformed] Call completed normally." },
      { level: "PASS", text: "✔ [tool_call:divide:valid] Call completed normally." },
      { level: "PASS", text: "✔ [tool_call:divide:malformed] Call completed normally." },
      { level: "PASS", text: "✔ [tool_call:divide:edge_case] Call completed normally." },
    ],
    summary: "8 passed, 0 failed, 0 warnings",
    result: "RESULT: ALL CLEAR.",
    resultOk: true,
  },
};

const levelColor: Record<Level, string> = {
  PASS: "text-pass",
  FAIL: "text-fail font-bold",
  WARN: "text-warn",
  INFO: "text-muted",
};

export function Hero() {
  const [active, setActive] = useState<"broken" | "clean">("broken");
  const [visibleCount, setVisibleCount] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
  const termRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const termY = useTransform(scrollY, [0, 500], [0, 40]);

  const report = REPORTS[active];

  useEffect(() => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
    setVisibleCount(0);
    setShowSummary(false);

    report.lines.forEach((_, i) => {
      const t = setTimeout(() => setVisibleCount(i + 1), 120 + i * 90);
      timeouts.current.push(t);
    });
    const finalT = setTimeout(
      () => setShowSummary(true),
      120 + report.lines.length * 90 + 150
    );
    timeouts.current.push(finalT);

    return () => timeouts.current.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <section className="pt-16 pb-6">
      <div className="flex items-center gap-2 font-mono text-[0.75rem] text-gold uppercase tracking-[0.12em] mb-5">
        <span className="w-[5px] h-[5px] rounded-full bg-gold" />
        MCP connector preflight
      </div>

      <h1 className="font-mono font-bold text-[clamp(2rem,4.4vw,3rem)] leading-[1.18] max-w-[17ch] mb-5 -tracking-[0.01em]">
        Checks your MCP connector before a user finds out it&apos;s broken.
      </h1>

      <p className="text-[1.08rem] text-muted max-w-[54ch] mb-8">
        Fourgate spawns your <strong className="text-text font-semibold">MCP</strong> server,
        speaks real JSON-RPC to it over stdio, and catches the failure modes that break agent
        connections silently — before you ship.
      </p>

      <div className="flex flex-wrap gap-3 mb-12">
        <a
          href="https://github.com/hifzabuildsai/fourgate"
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-2 font-mono text-[0.83rem] font-bold px-[18px] py-[11px] rounded-[7px] bg-gold text-bg transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-8px_rgba(217,164,65,0.45)]"
        >
          View on GitHub →
        </a>
        <a
          href="#term"
          className="inline-flex items-center gap-2 font-mono text-[0.83rem] font-bold px-[18px] py-[11px] rounded-[7px] bg-surface text-text border border-border transition-all hover:-translate-y-0.5 hover:border-gold-dim hover:bg-surface-2"
        >
          Watch it run
        </a>
      </div>

      <motion.div id="term" style={{ y: termY }}>
        <div className="rounded-[10px] border border-border bg-surface overflow-hidden transition-all hover:border-gold-dim hover:shadow-[0_24px_60px_-30px_rgba(217,164,65,0.25)]">
          <div className="flex items-center justify-between px-4 py-[11px] bg-surface-2 border-b border-border flex-wrap gap-2.5">
            <div className="flex gap-1.5">
              <span className="w-[9px] h-[9px] rounded-full bg-[#2c3038] block" />
              <span className="w-[9px] h-[9px] rounded-full bg-[#2c3038] block" />
              <span className="w-[9px] h-[9px] rounded-full bg-[#2c3038] block" />
            </div>
            <div className="font-mono text-[0.76rem] text-muted">fourgate — real captured output</div>
            <div className="flex gap-1 bg-bg rounded-[7px] p-[3px] border border-border">
              <button
                onClick={() => setActive("broken")}
                className={`font-mono text-[0.71rem] px-[11px] py-[5px] rounded-[5px] transition-colors ${
                  active === "broken" ? "bg-surface text-text" : "text-muted"
                }`}
              >
                broken_server.py
              </button>
              <button
                onClick={() => setActive("clean")}
                className={`font-mono text-[0.71rem] px-[11px] py-[5px] rounded-[5px] transition-colors ${
                  active === "clean" ? "bg-surface text-text" : "text-muted"
                }`}
              >
                clean_server.py
              </button>
            </div>
          </div>

          <div ref={termRef} className="font-mono text-[0.81rem] px-5 py-[22px] min-h-[320px] whitespace-pre-wrap break-words">
            <div className="text-text font-bold">Fourgate Preflight Report — {report.server}</div>
            <div className="text-border">{"=".repeat(58)}</div>
            {report.lines.slice(0, visibleCount).map((l, i) => (
              <div key={i} className={levelColor[l.level]}>
                {"  " + l.text}
              </div>
            ))}
            {showSummary && (
              <>
                <div className="text-border">{"-".repeat(58)}</div>
                <div className="text-muted">{"  " + report.summary}</div>
                <div>&nbsp;</div>
                <div className={`font-extrabold ${report.resultOk ? "text-pass" : "text-fail"}`}>
                  {"  " + report.result}
                </div>
                <span className="inline-block w-[7px] h-[14px] bg-gold align-middle animate-blink" />
              </>
            )}
          </div>
        </div>
        <p className="text-[0.83rem] text-muted-2 mt-3.5">
          Real output of{" "}
          <code className="font-mono">
            python3 checker/preflight.py fixtures/&lt;server&gt;.py
          </code>{" "}
          — not a mockup.
        </p>
      </motion.div>
    </section>
  );
}
