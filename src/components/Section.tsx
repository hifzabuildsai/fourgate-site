import type { ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[76rem] px-4 sm:px-8 ${className}`}>{children}</div>;
}

/**
 * Page section. "split" puts the heading in a narrow left column on wide
 * screens (it stays put while the content scrolls); "stack" puts it above.
 */
export default function Section({
  id,
  title,
  intro,
  children,
  layout = "split",
  as: Heading = "h2",
  rule = true,
  className = "",
}: {
  id?: string;
  title?: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
  layout?: "split" | "stack";
  as?: "h1" | "h2";
  rule?: boolean;
  className?: string;
}) {
  const headingId = id && title ? `${id}-title` : undefined;
  const heading = (title || intro) && (
    <header className={layout === "split" ? "lg:sticky lg:top-24" : "max-w-3xl"}>
      {title && (
        <Heading
          id={headingId}
          className={`font-display text-balance ${
            Heading === "h1" ? "text-[2.25rem] leading-[1.06] sm:text-h1" : "text-[1.75rem] leading-[1.12] sm:text-h2"
          }`}
        >
          {title}
        </Heading>
      )}
      {intro && <div className="prose-fg mt-5 text-lead text-muted">{intro}</div>}
    </header>
  );

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`${rule ? "border-t border-line" : ""} py-16 sm:py-24 ${className}`}
    >
      <Container>
        {layout === "split" ? (
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            {heading && <div className="lg:col-span-4">{heading}</div>}
            <div className={heading ? "min-w-0 lg:col-span-8" : "min-w-0 lg:col-span-12"}>{children}</div>
          </div>
        ) : (
          <>
            {heading && <div className="mb-12">{heading}</div>}
            {children}
          </>
        )}
      </Container>
    </section>
  );
}
