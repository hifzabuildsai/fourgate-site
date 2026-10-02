"use client";

import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { INIT_FLAGS, type InitFile } from "@/content/init-example/flagmap";

type Line = { text: string; path: string | null };

/** Pretty-prints like JSON.stringify(value, null, 2), remembering the JSON path of each line. */
function toLines(value: unknown, path = "", key?: string, depth = 0, last = true): Line[] {
  const pad = "  ".repeat(depth);
  const head = key !== undefined ? `${JSON.stringify(key)}: ` : "";
  const comma = last ? "" : ",";
  if (Array.isArray(value)) {
    if (value.length === 0) return [{ text: `${pad}${head}[]${comma}`, path }];
    return [
      { text: `${pad}${head}[`, path },
      ...value.flatMap((v, i) => toLines(v, `${path}/${i}`, undefined, depth + 1, i === value.length - 1)),
      { text: `${pad}]${comma}`, path: null },
    ];
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return [{ text: `${pad}${head}{}${comma}`, path }];
    return [
      { text: `${pad}${head}{`, path: path || null },
      ...entries.flatMap(([k, v], i) => toLines(v, `${path}/${k}`, k, depth + 1, i === entries.length - 1)),
      { text: `${pad}}${comma}`, path: null },
    ];
  }
  return [{ text: `${pad}${head}${JSON.stringify(value)}${comma}`, path }];
}

type Active = { kind: "flag"; id: string } | { kind: "line"; file: InitFile; path: string } | null;

/** Flags that produced a line: exact match, or the line sits inside a key the flag produced. */
function flagsForLine(file: InitFile, path: string) {
  return INIT_FLAGS.filter((f) => (f.produces[file] ?? []).some((q) => path === q || path.startsWith(`${q}/`))).map((f) => f.id);
}

/**
 * The files `fourgate init` wrote, as tabs, next to the command that wrote them.
 * Hover or focus a flag to light up the JSON keys it produced (counts per file on
 * the tabs); hover or focus a key to light up the flag(s) behind it. The mapping
 * comes from running the real command (src/content/init-example/flagmap.ts).
 */
export default function InitExplorer({ files, command }: { files: { name: InitFile; raw: string }[]; command: string }) {
  const [tab, setTab] = useState<InitFile>(files[0].name);
  const [active, setActive] = useState<Active>(null);
  const [copied, setCopied] = useState(false);
  const reduce = useReducedMotion();
  const uid = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const parsed = useMemo(() => Object.fromEntries(files.map((f) => [f.name, toLines(JSON.parse(f.raw))])) as Record<InitFile, Line[]>, [files]);

  const flagActive = (id: string) =>
    active?.kind === "flag" ? active.id === id : active?.kind === "line" ? flagsForLine(active.file, active.path).includes(id) : false;
  const lineActive = (file: InitFile, path: string | null) => {
    if (!path || !active) return false;
    if (active.kind === "line") return active.file === file && active.path === path;
    const f = INIT_FLAGS.find((x) => x.id === active.id);
    return Boolean(f?.produces[file]?.includes(path));
  };
  const count = (file: InitFile) => (active?.kind === "flag" ? INIT_FLAGS.find((x) => x.id === active.id)?.produces[file]?.length ?? 0 : 0);

  const describe = () => {
    if (active?.kind !== "flag") return "";
    const f = INIT_FLAGS.find((x) => x.id === active.id)!;
    const parts = Object.entries(f.produces).map(([file, paths]) => `${file}: ${paths!.map((p) => p.slice(1).replace(/\//g, ".")).join(", ")}`);
    return `${f.flag} produced ${parts.join("; ")}`;
  };

  function onTabKey(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    const n = files.length;
    const map: Record<string, number> = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: n - 1 };
    if (!(e.key in map)) return;
    e.preventDefault();
    const next = (map[e.key] + n) % n;
    setTab(files[next].name);
    tabRefs.current[next]?.focus();
  }

  async function copyCommand() {
    try {
      await navigator.clipboard.writeText(command);
    } catch {
      /* clipboard unavailable: nothing to do */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  const hl = "bg-foreground/[0.09] shadow-[inset_2px_0_0_var(--foreground)]";

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      {/* The command, one flag per line */}
      <div className="overflow-hidden rounded-[14px] border border-line bg-code">
        <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-1.5">
          <span className="text-cap text-muted">Generate the files</span>
          <button
            type="button"
            onClick={copyCommand}
            className={`min-h-8 rounded-[6px] px-2 text-cap font-medium ${copied ? "bg-foreground text-background" : "text-muted hover:bg-raised hover:text-foreground"}`}
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <div className="p-3 font-mono text-[0.8125rem] leading-relaxed" onMouseLeave={() => setActive(null)}>
          <p className="px-2 text-foreground">
            <span aria-hidden="true" className="select-none text-muted">
              ${" "}
            </span>
            fourgate init \
          </p>
          <ul aria-label="Flags">
            {INIT_FLAGS.map((f, i) => (
              <li key={f.id}>
                <button
                  type="button"
                  onMouseEnter={() => setActive({ kind: "flag", id: f.id })}
                  onFocus={() => setActive({ kind: "flag", id: f.id })}
                  onBlur={() => setActive(null)}
                  className={`w-full rounded-[6px] px-2 py-0.5 pl-6 text-left transition-colors ${flagActive(f.id) ? hl : "hover:bg-raised"}`}
                >
                  <span className="text-foreground">{f.flag}</span> <span className="break-all text-muted">{f.value}</span>
                  {i < INIT_FLAGS.length - 1 && <span className="text-muted"> \</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <p className="sr-only" aria-live="polite">
          {describe()}
        </p>
      </div>

      {/* The generated files as tabs */}
      <div className="min-w-0 overflow-hidden rounded-[14px] border border-line bg-code">
        <LayoutGroup id={`${uid}-files`}>
          <div role="tablist" aria-label="Generated files" className="flex flex-wrap gap-1 border-b border-line p-1.5">
            {files.map((f, i) => {
              const on = f.name === tab;
              const n = count(f.name);
              return (
                <button
                  key={f.name}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  role="tab"
                  type="button"
                  id={`${uid}-tab-${f.name}`}
                  aria-selected={on}
                  aria-controls={`${uid}-panel`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => setTab(f.name)}
                  onKeyDown={(e) => onTabKey(e, i)}
                  className={`relative inline-flex min-h-8 min-w-0 items-center gap-1.5 rounded-[7px] px-3 font-mono text-cap ${on ? "text-background" : "text-muted hover:text-foreground"}`}
                >
                  {on && (
                    <motion.span
                      layoutId="file-pill"
                      aria-hidden="true"
                      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 520, damping: 40 }}
                      className="absolute inset-0 rounded-[7px] bg-foreground"
                    />
                  )}
                  <span className="relative whitespace-nowrap">fourgate-config/{f.name}</span>
                  {n > 0 && (
                    <span className={`relative rounded-full px-1.5 text-[0.625rem] ${on ? "bg-background/20" : "bg-foreground/10 text-foreground"}`}>
                      {n}
                      <span className="sr-only"> highlighted</span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </LayoutGroup>
        <div role="tabpanel" id={`${uid}-panel`} aria-labelledby={`${uid}-tab-${tab}`}>
          <pre className="fg-scroll max-h-[30rem] overflow-auto py-3 font-mono text-[0.75rem] leading-[1.7] text-foreground" onMouseLeave={() => setActive(null)}>
            <code className="block min-w-max">
              {parsed[tab].map((line, i) => {
                const owners = line.path ? flagsForLine(tab, line.path) : [];
                const interactive = owners.length > 0;
                return (
                  <span
                    key={i}
                    tabIndex={interactive ? 0 : undefined}
                    onMouseEnter={interactive ? () => setActive({ kind: "line", file: tab, path: line.path! }) : undefined}
                    onFocus={interactive ? () => setActive({ kind: "line", file: tab, path: line.path! }) : undefined}
                    onBlur={interactive ? () => setActive(null) : undefined}
                    className={`block whitespace-pre px-4 transition-colors ${lineActive(tab, line.path) ? hl : ""} ${interactive ? "cursor-default outline-none focus-visible:bg-foreground/[0.09]" : ""}`}
                  >
                    {line.text}
                  </span>
                );
              })}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}
