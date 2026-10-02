export type Status = "PASS" | "FAIL" | "CONFIRMED FAIL" | "UNKNOWN";

const styles: Record<Status, { symbol: string; cls: string }> = {
  PASS: { symbol: "✓", cls: "text-pass border-pass/40 bg-pass/10" },
  FAIL: { symbol: "✕", cls: "text-fail border-fail/40 bg-fail/10" },
  "CONFIRMED FAIL": { symbol: "✕", cls: "text-fail border-fail/40 bg-fail/10" },
  UNKNOWN: { symbol: "?", cls: "text-unknown border-unknown/40 bg-unknown/10" },
};

/** Verdict pill. Always pairs color with a symbol and the word, never color alone. */
export default function StatusBadge({ status, size = "md" }: { status: Status; size?: "sm" | "md" }) {
  const s = styles[status];
  const sz = size === "sm" ? "px-2 py-0.5 text-[0.7rem]" : "px-2.5 py-1 text-xs";
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border font-mono font-semibold tracking-wide ${sz} ${s.cls}`}
    >
      <span aria-hidden="true">{s.symbol}</span>
      {status}
    </span>
  );
}
