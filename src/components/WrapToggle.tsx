"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

// Illustrative MCP client entry. The wrapped form uses the exact guard flags
// from the product README: --contracts, --mode shadow, --server, --log, --.
type Line = { text: string; change?: "add" | "del" };

const before: Line[] = [
  { text: "{" },
  { text: '  "mcpServers": {' },
  { text: '    "my-server": {' },
  { text: '      "command": "python",', change: "del" },
  { text: '      "args": ["your_server.py"]', change: "del" },
  { text: "    }" },
  { text: "  }" },
  { text: "}" },
];

const after: Line[] = [
  { text: "{" },
  { text: '  "mcpServers": {' },
  { text: '    "my-server": {' },
  { text: '      "command": "fourgate",', change: "add" },
  { text: '      "args": [', change: "add" },
  { text: '        "guard",', change: "add" },
  { text: '        "--contracts", "runtime.json",', change: "add" },
  { text: '        "--mode", "shadow",', change: "add" },
  { text: '        "--server", "my-server",', change: "add" },
  { text: '        "--log", "outcomes.jsonl",', change: "add" },
  { text: '        "--",', change: "add" },
  { text: '        "python", "your_server.py"', change: "add" },
  { text: "      ]", change: "add" },
  { text: "    }" },
  { text: "  }" },
  { text: "}" },
];

const shell = {
  before: "python your_server.py",
  after: "fourgate guard --contracts runtime.json --mode shadow --server my-server --log outcomes.jsonl -- python your_server.py",
};

export default function WrapToggle() {
  const [wrapped, setWrapped] = useState(false);
  const reduce = useReducedMotion();
  const lines = wrapped ? after : before;

  return (
    <div className="overflow-hidden rounded-[14px] border border-line bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
        <div role="group" aria-label="Server entry" className="inline-flex rounded-[8px] border border-line p-0.5">
          {[false, true].map((w) => (
            <button
              key={String(w)}
              type="button"
              aria-pressed={wrapped === w}
              onClick={() => setWrapped(w)}
              className="min-h-9 rounded-[6px] px-3 text-small text-muted aria-pressed:bg-foreground aria-pressed:text-background"
            >
              {w ? "After: wrapped" : "Before"}
            </button>
          ))}
        </div>
        <span className="text-cap text-muted">Illustrative client config</span>
      </div>

      <pre className="fg-scroll overflow-x-auto bg-code py-4 font-mono text-[0.8125rem] leading-[1.75]" aria-live="polite">
        <code className="block min-w-max">
          <AnimatePresence initial={false} mode="popLayout">
            {lines.map((l, i) => {
              const mark = wrapped ? l.change : undefined;
              const key = l.change ? `${wrapped ? "a" : "b"}-${i}` : `same-${l.text}-${i < 4 ? i : lines.length - i}`;
              return (
                <motion.span
                  key={key}
                  layout={reduce ? false : "position"}
                  initial={reduce || !l.change ? false : { opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0, transition: { duration: 0.2, delay: l.change ? 0.03 * (i - 3) : 0 } }}
                  exit={reduce ? undefined : { opacity: 0, transition: { duration: 0.08 } }}
                  className={`block px-4 sm:px-5 ${
                    mark === "add" ? "bg-foreground/[0.07] text-foreground" : l.change ? "text-foreground" : "text-muted"
                  }`}
                >
                  <span aria-hidden="true" className="mr-3 inline-block w-3 select-none text-muted">
                    {mark === "add" ? "+" : " "}
                  </span>
                  {l.text}
                </motion.span>
              );
            })}
          </AnimatePresence>
        </code>
      </pre>

      <div className="border-t border-line px-4 py-3 sm:px-5">
        <p className="text-cap text-muted">Same thing as a shell command</p>
        <p className="mt-1 break-words font-mono text-[0.8125rem] text-foreground">{wrapped ? shell.after : shell.before}</p>
        <p className="mt-3 max-w-[68ch] text-cap text-muted">
          The file name and shape depend on your MCP client; only the command changes. runtime.json is the contract file
          fourgate init writes.
        </p>
      </div>
    </div>
  );
}
