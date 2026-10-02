import type { ReactNode } from "react";
import { Container } from "./Section";

export default function CtaBand({
  title,
  text,
  children,
}: {
  title: string;
  text?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="relative overflow-hidden rounded-2xl border border-border bg-surface px-6 py-10 sm:px-10 sm:py-12">
          <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">{title}</h2>
              {text && <div className="mt-3 text-muted">{text}</div>}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:shrink-0">{children}</div>
          </div>
        </div>
      </Container>
    </section>
  );
}
