import type { ReactNode } from "react";

/** A bordered note. "caution" marks something with real-world side effects. */
export default function Callout({
  title,
  tone = "note",
  children,
}: {
  title: string;
  tone?: "note" | "caution";
  children: ReactNode;
}) {
  return (
    <aside
      className={`rounded-[10px] border p-5 sm:p-6 ${
        tone === "caution" ? "border-foreground/40 bg-surface" : "border-line"
      }`}
    >
      <p className="font-medium text-foreground">{title}</p>
      <div className="prose-fg mt-2 text-small text-muted">{children}</div>
    </aside>
  );
}
