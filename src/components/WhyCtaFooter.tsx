"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.2, 0.7, 0.2, 1] as const } },
};

export function WhySection() {
  return (
    <motion.section
      className="pt-14 pb-2"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={fadeUp}
    >
      <h2 className="font-mono text-[1.15rem] font-bold mb-3.5">What&apos;s actually checked today</h2>
      <p className="text-muted max-w-[60ch] mb-3.5">
        Fourgate v0 catches <strong className="text-text">stdout pollution</strong> — the single most
        common way an MCP connector silently breaks: a leftover <code className="font-mono bg-surface border border-border rounded px-1.5 py-0.5 text-gold text-[0.88em]">print()</code>{" "}
        statement corrupts the JSON-RPC stream, and the failure is invisible until an agent hits it in
        production.
      </p>
      <p className="text-muted max-w-[60ch] mb-3.5">
        It also fires a valid call, a wrong-typed call, and a numeric edge case at every declared tool,
        and reports whether the server fails closed with a clean error or fails open with a crash or a hang.
      </p>
      <p className="text-muted max-w-[60ch] mb-3.5">
        Honest limitation: FastMCP already catches most unhandled exceptions on its own. Stdout pollution
        is the real, narrow gap — the one thing the framework doesn&apos;t protect you from.
      </p>
    </motion.section>
  );
}

export function CtaSection() {
  return (
    <motion.section
      className="pt-14 pb-10 mt-14 border-t border-border-soft"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={fadeUp}
    >
      <h2 className="font-mono text-[1.4rem] font-bold mb-2.5">Run it on your own connector</h2>
      <p className="text-muted mb-6 max-w-[52ch]">
        The full checker, both fixtures, and the source are on GitHub. Open-core, MIT licensed.
      </p>
      <div className="flex flex-wrap gap-3 mb-6">
        <a
          href="https://github.com/hifzabuildsai/fourgate"
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-2 font-mono text-[0.83rem] font-bold px-[18px] py-[11px] rounded-[7px] bg-gold text-bg transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-8px_rgba(217,164,65,0.45)]"
        >
          View on GitHub →
        </a>
        <a
          href="https://github.com/hifzabuildsai/fourgate#quickstart"
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-2 font-mono text-[0.83rem] font-bold px-[18px] py-[11px] rounded-[7px] bg-surface text-text border border-border transition-all hover:-translate-y-0.5 hover:border-gold-dim hover:bg-surface-2"
        >
          Quickstart
        </a>
      </div>
      <div className="font-mono text-[0.8rem] text-muted bg-surface border border-border rounded-[8px] px-4 py-3.5 overflow-x-auto">
        $ git clone <span className="text-pass">https://github.com/hifzabuildsai/fourgate.git</span>
        <br />
        $ cd fourgate &amp;&amp; pip install -r requirements.txt
        <br />
        $ bash demo.sh
      </div>
    </motion.section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border-soft py-6 pb-12 text-[0.78rem] text-muted-2 font-mono">
      Fourgate — built in public by{" "}
      <a
        href="https://github.com/hifzabuildsai"
        target="_blank"
        rel="noopener"
        className="text-gold"
      >
        @hifzabuildsai
      </a>
    </footer>
  );
}
