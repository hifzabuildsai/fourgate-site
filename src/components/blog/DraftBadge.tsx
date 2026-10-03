/** Visible "Draft" marker. Text plus a dashed border, so it does not rely on color. */
export default function DraftBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-[4px] border border-dashed border-foreground/50 px-2 py-0.5 font-mono text-cap font-medium uppercase tracking-wide text-foreground ${className}`}
    >
      Draft
    </span>
  );
}
