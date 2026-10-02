import type { ReactNode } from "react";

type Tone = "note" | "honest" | "warn";

const tones: Record<Tone, { label: string; cls: string }> = {
  note: { label: "Note", cls: "border-accent/40 before:bg-accent" },
  honest: { label: "Honest note", cls: "border-border-strong before:bg-muted" },
  warn: { label: "Important", cls: "border-unknown/40 before:bg-unknown" },
};

export default function Callout({
  tone = "note",
  title,
  children,
}: {
  tone?: Tone;
  title?: string;
  children: ReactNode;
}) {
  const t = tones[tone];
  return (
    <aside
      className={`relative overflow-hidden rounded-xl border bg-surface p-5 pl-6 before:absolute before:inset-y-0 before:left-0 before:w-1 ${t.cls}`}
    >
      <p className="mb-1.5 text-sm font-semibold text-text">{title ?? t.label}</p>
      <div className="prose-fg text-sm leading-relaxed text-muted">{children}</div>
    </aside>
  );
}
