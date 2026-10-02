import type { ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${className}`}>{children}</div>;
}

export default function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  className = "",
  as: Heading = "h2",
}: {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <section id={id} className={`py-16 sm:py-20 ${className}`} aria-labelledby={id && title ? `${id}-title` : undefined}>
      <Container>
        {(eyebrow || title || intro) && (
          <header className="mb-10 max-w-3xl">
            {eyebrow && (
              <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.14em] text-accent">{eyebrow}</p>
            )}
            {title && (
              <Heading
                id={id ? `${id}-title` : undefined}
                className={
                  Heading === "h1"
                    ? "text-3xl font-semibold tracking-tight text-balance sm:text-5xl"
                    : "text-2xl font-semibold tracking-tight text-balance sm:text-3xl"
                }
              >
                {title}
              </Heading>
            )}
            {intro && <div className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{intro}</div>}
          </header>
        )}
        {children}
      </Container>
    </section>
  );
}
