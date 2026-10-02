import ButtonLink from "@/components/ButtonLink";
import Section from "@/components/Section";
import StatusBadge from "@/components/StatusBadge";

export default function NotFound() {
  return (
    <Section id="top" as="h1" title="Page not found">
      <p className="mb-6 flex items-center gap-3 text-muted">
        <StatusBadge status="UNKNOWN" /> We could not confirm this page exists, so we won&apos;t pretend it does.
      </p>
      <ButtonLink href="/" variant="secondary">
        Back to home
      </ButtonLink>
    </Section>
  );
}
