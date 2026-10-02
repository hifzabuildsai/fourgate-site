/**
 * Fourgate mark: four vertical bars, one per gate, on a shared threshold.
 * The fourth bar is split, the gap where a verdict is made.
 */
export function GateMark({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true" fill="currentColor">
      <rect x="2" y="3" width="2.4" height="13" rx="0.6" />
      <rect x="6.6" y="3" width="2.4" height="13" rx="0.6" />
      <rect x="11.2" y="3" width="2.4" height="13" rx="0.6" />
      <rect x="15.8" y="3" width="2.4" height="5.6" rx="0.6" />
      <rect x="15.8" y="10.4" width="2.4" height="5.6" rx="0.6" />
      <rect x="1" y="17.4" width="18" height="1.4" rx="0.5" />
    </svg>
  );
}

export default function Wordmark() {
  return (
    <span className="inline-flex items-center gap-2 text-foreground">
      <GateMark />
      <span className="font-display text-[1.0625rem] leading-none">Fourgate</span>
    </span>
  );
}
