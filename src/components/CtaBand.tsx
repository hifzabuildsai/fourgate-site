import type { ReactNode } from "react";
import { Container } from "./Section";
import { GateMark } from "./Wordmark";

export default function CtaBand({ title, text, children }: { title: string; text?: ReactNode; children: ReactNode }) {
  return (
    <section className="border-t border-line">
      <Container className="grid gap-8 py-16 sm:py-24 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <GateMark className="mb-6 h-8 w-8 text-foreground" />
          <h2 className="font-display text-[1.75rem] leading-[1.12] text-balance sm:text-h2">{title}</h2>
          {text && <div className="prose-fg mt-4 text-lead text-muted">{text}</div>}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:justify-end">{children}</div>
      </Container>
    </section>
  );
}
