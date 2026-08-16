"use client";

import { motion } from "framer-motion";

const ROWS = [
  { feature: "Runs automatically, no manual clicking", us: true, inspector: "manual", trust: true },
  { feature: "Catches stdout pollution", us: true, inspector: "indirect", trust: "not focus" },
  { feature: "Plain-language report for beginners", us: true, inspector: false, trust: false },
  { feature: "Built for a first connector, not a fleet", us: true, inspector: "general", trust: "enterprise CI" },
];

function Cell({ value }: { value: boolean | string }) {
  if (value === true) return <span className="text-pass font-bold font-mono">yes</span>;
  if (value === false) return <span className="text-muted-2 font-mono">no</span>;
  return <span className="text-muted-2 font-mono">{value}</span>;
}

export function Compare() {
  return (
    <motion.section
      id="compare"
      className="pt-16 pb-2"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
    >
      <div className="font-mono text-[0.75rem] text-gold uppercase tracking-[0.1em] mb-1.5">
        Honest comparison
      </div>
      <h2 className="font-mono text-[1.25rem] font-bold mb-6.5">
        Where Fourgate sits next to what already exists
      </h2>

      <div className="rounded-[10px] border border-border bg-surface px-4 overflow-x-auto">
        <table className="w-full border-collapse text-[0.86rem] min-w-[480px]">
          <thead>
            <tr>
              <th className="text-left py-3.5 px-3.5 font-mono text-[0.74rem] text-muted font-semibold">&nbsp;</th>
              <th className="text-center py-3.5 px-3.5 font-mono text-[0.74rem] text-gold font-semibold">Fourgate</th>
              <th className="text-center py-3.5 px-3.5 font-mono text-[0.74rem] text-muted font-semibold">MCP Inspector</th>
              <th className="text-center py-3.5 px-3.5 font-mono text-[0.74rem] text-muted font-semibold">MCPTrust</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.feature} className="border-t border-border-soft transition-colors hover:bg-surface-2">
                <td className="py-3.5 px-3.5 text-muted">{r.feature}</td>
                <td className="py-3.5 px-3.5 text-center"><Cell value={r.us} /></td>
                <td className="py-3.5 px-3.5 text-center"><Cell value={r.inspector} /></td>
                <td className="py-3.5 px-3.5 text-center"><Cell value={r.trust} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[0.78rem] text-muted-2 mt-3">
        Not a replacement for either tool — Inspector and MCPTrust are built for teams already running
        production MCP fleets. Fourgate is for someone shipping their first connector.
      </p>
    </motion.section>
  );
}
