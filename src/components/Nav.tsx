export function Nav() {
  return (
    <nav className="sticky top-0 z-10 border-b border-border-soft bg-bg/85 backdrop-blur-md">
      <div className="mx-auto max-w-[1040px] px-6 flex items-center justify-between py-4">
        <div className="flex items-center gap-2 font-mono font-extrabold text-sm tracking-wide">
          <span className="inline-flex gap-[3px]">
            <i className="block w-1 h-[15px] rounded-[1px] bg-gold" />
            <i className="block w-1 h-[15px] rounded-[1px] bg-gold-dim" />
            <i className="block w-1 h-[15px] rounded-[1px] bg-gold" />
            <i className="block w-1 h-[15px] rounded-[1px] bg-gold-dim" />
          </span>
          FOURGATE
        </div>
        <div className="flex items-center gap-5 font-mono text-[0.78rem] text-muted">
          <a
            href="https://github.com/hifzabuildsai/fourgate"
            target="_blank"
            rel="noopener"
            className="hover:text-text transition-colors"
          >
            GitHub
          </a>
          <a href="#compare" className="hover:text-text transition-colors">
            Compare
          </a>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[0.7rem] text-muted">
            <span className="w-[5px] h-[5px] rounded-full bg-pass" />
            v0 · open source
          </span>
        </div>
      </div>
    </nav>
  );
}
