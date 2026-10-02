/** Original Fourgate mark: an open gate (arch) with a check inside it. */
export function GateMark({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <path
        d="M4.5 21V10.5a7.5 7.5 0 0 1 15 0V21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M2.5 21h19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="m8.5 14.5 2.5 2.5 4.5-5"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Wordmark() {
  return (
    <span className="inline-flex items-center gap-2 text-text">
      <GateMark />
      <span className="text-[1.05rem] font-semibold tracking-tight">Fourgate</span>
    </span>
  );
}
