import ButtonLink from "./ButtonLink";
import { EMAIL_HREF, PRIMARY_CTA } from "@/site.config";

/** Primary: book the scope call. Secondary: email. Hidden pieces degrade when config is empty. */
export default function ContactCtas({ subject = "Fourgate design partner" }: { subject?: string }) {
  return (
    <>
      <ButtonLink href={PRIMARY_CTA.href}>{PRIMARY_CTA.label}</ButtonLink>
      <ButtonLink href={EMAIL_HREF ? `${EMAIL_HREF}?subject=${encodeURIComponent(subject)}` : ""} variant="secondary">
        Email us
      </ButtonLink>
    </>
  );
}
