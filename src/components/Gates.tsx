"use client";

import { motion } from "framer-motion";

const GATES = [
  {
    title: "One gateway",
    desc: "A single connector surface, not a scattered pile of endpoints.",
    status: "soon" as const,
  },
  {
    title: "Tools only",
    desc: "No resources or prompts silently carrying app logic.",
    status: "soon" as const,
  },
  {
    title: "Prove identity",
    desc: "Identity from a verified token — never a tool argument.",
    status: "soon" as const,
  },
  {
    title: "Fail closed",
    desc: "Say it can't continue, never improvise an answer.",
    status: "live" as const,
  },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.02 },
  },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.2, 0.7, 0.2, 1] as const } },
};

export function Gates() {
  return (
    <section className="pt-14 pb-2">
      <div className="font-mono text-[0.75rem] text-gold uppercase tracking-[0.1em] mb-1.5">
        Where the name comes from
      </div>
      <h2 className="font-mono text-[1.25rem] font-bold mb-7">
        Four invariants every connector should hold
      </h2>
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
      >
        {GATES.map((g) => (
          <motion.div
            key={g.title}
            variants={item}
            className="rounded-[10px] border border-border bg-surface p-4 pb-4 transition-all hover:-translate-y-1 hover:border-gold-dim hover:shadow-[0_16px_34px_-18px_rgba(0,0,0,0.5)]"
          >
            <div className="h-[3px] rounded-[2px] bg-border mb-3.5 overflow-hidden relative">
              <motion.i
                className="absolute inset-0 bg-gold origin-left block"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
            <h3 className="font-mono text-[0.86rem] mb-1.5">{g.title}</h3>
            <p className="text-[0.8rem] text-muted m-0">{g.desc}</p>
            <span
              className={`inline-block mt-2.5 font-mono text-[0.66rem] px-[7px] py-0.5 rounded-[4px] border ${
                g.status === "live"
                  ? "bg-pass/10 text-pass border-pass/30"
                  : "bg-muted/10 text-muted border-border"
              }`}
            >
              {g.status === "live" ? "v0 checks this" : "on roadmap"}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
