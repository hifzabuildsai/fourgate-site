export type Status = "PASS" | "FAIL" | "CONFIRMED FAIL" | "UNKNOWN";

const styles: Record<Status, { symbol: string; cls: string }> = {
  PASS: { symbol: "✓", cls: "text-pass border-pass/45" },
  FAIL: { symbol: "✕", cls: "text-fail border-fail/45" },
  "CONFIRMED FAIL": { symbol: "✕", cls: "text-fail border-fail/45" },
  UNKNOWN: { symbol: "?", cls: "text-unknown border-unknown/45" },
};

/** Verdict chip. Color always comes with a symbol and the word. */
export default function StatusBadge({ status, size = "md" }: { status: Status; size?: "sm" | "md" }) {
  const s = styles[status];
  const sz = size === "sm" ? "px-1.5 py-px text-[0.6875rem]" : "px-2 py-0.5 text-cap";
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-[4px] border font-mono font-medium align-middle ${sz} ${s.cls}`}
    >
      <span aria-hidden="true">{s.symbol}</span>
      {status}
    </span>
  );
}
