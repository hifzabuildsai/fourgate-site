import ButtonLink from "@/components/ButtonLink";
import ContactCtas from "@/components/ContactCtas";
import SpotlightCard from "@/components/SpotlightCard";
import ComparisonTable from "@/components/ComparisonTable";
import CtaBand from "@/components/CtaBand";
import FAQ, { type FaqItem } from "@/components/FAQ";
import Section from "@/components/Section";
import { externalProps } from "@/lib/links";
import { pageMetadata } from "@/lib/metadata";
import { EMAIL_HREF, GITHUB_URL, ISSUES_URL, PRIMARY_CTA } from "@/site.config";

export const metadata = pageMetadata({
  title: "Pricing",
  description:
    "Fourgate is free and open source (MIT). The Fourgate Founding Pilot is $300 one-time: outcome checks for up to three write tools, a CI job, and a fix report with evidence.",
  path: "/pricing",
});

type Plan = {
  name: string;
  price: string;
  unit?: string;
  blurb: string;
  note?: string;
  features: string[];
  cta: { href: string; label: string; variant: "primary" | "secondary" };
  featured?: boolean;
};

const plans: Plan[] = [
  {
    name: "Open Source",
    price: "Free",
    unit: "forever",
    blurb: "The whole product, on your machine.",
    features: [
      "MIT License",
      "All six commands: demo, init, doctor, scan, guard, summary",
      "Runs on your machine; no account, no telemetry",
      "Community support via GitHub issues",
    ],
    cta: { href: GITHUB_URL, label: "Get it on GitHub", variant: "secondary" },
  },
  {
    name: "Fourgate Founding Pilot",
    price: "$300",
    unit: "one-time",
    blurb:
      "We write outcome checks for up to three of your state-changing write tools, add them to your CI against a test account you create, and send a fix report with evidence for anything that says success without doing it.",
    note: "Ongoing support after the pilot is optional, by agreement. Invoiced after the scope call.",
    features: [
      "Founder-assisted setup",
      "Outcome contracts for up to three write tools, reviewed with you",
      "A CI job added through a pull request you merge",
      "Fix report with evidence: PASS / FAIL / UNKNOWN",
      "A review call at day 30",
    ],
    cta: { href: PRIMARY_CTA.href, label: PRIMARY_CTA.label, variant: "primary" },
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Contact us",
    blurb: "More workflows or tools than the pilot scope.",
    features: ["Same open-source software, on your infrastructure", "Scope and terms by agreement"],
    cta: { href: EMAIL_HREF || PRIMARY_CTA.href, label: "Email us", variant: "secondary" },
  },
];

const faq: FaqItem[] = [
  {
    q: "Why is there no usage metering?",
    a: (
      <p>
        Fourgate runs on your machines and sends no telemetry, so there is nothing for us to meter, and we would rather keep it
        that way. You pay for help on a workflow, not per call.
      </p>
    ),
  },
  {
    q: "What counts as a tool?",
    a: (
      <p>
        A consequential, state-changing MCP tool that you protect with an outcome contract, for example a tool that creates an
        issue or sends an email. Tools without a contract are not checked and do not count.
      </p>
    ),
  },
  {
    q: "How do I pay?",
    a: (
      <p>
        The Fourgate Founding Pilot is invoiced after the scope call. There is no online checkout.
      </p>
    ),
  },
  {
    q: "What happens after the pilot?",
    a: <p>Nothing renews automatically. If you want ongoing help, we agree scope and terms together.</p>,
  },
  {
    q: "What do you need from us?",
    a: (
      <ul className="list-disc space-y-1 pl-5">
        <li>An MCP server launched as a local stdio process.</li>
        <li>For each protected tool, an API that can return the written record over HTTPS GET.</li>
        <li>A separate, read-only credential for that API, which you create and keep.</li>
        <li>A disposable test account for the contract scan.</li>
        <li>Python 3.10+ on Linux or Windows, and a 30-minute scope call.</li>
      </ul>
    ),
  },
];

export default function PricingPage() {
  return (
    <>
      <Section
        id="top"
        as="h1"
        layout="stack"
        rule={false}
        title="Free to run. Paid help to get it right."
        intro={<p>Every plan runs the same open-source software on your infrastructure. What you pay for is our time.</p>}
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {plans.map((p) => (
            <SpotlightCard
              key={p.name}
              trail={p.featured}
              className={`flex flex-col rounded-[16px] border p-6 sm:p-8 ${p.featured ? "border-foreground/50 bg-surface" : "border-line bg-background"}`}
            >
              <h2 className="text-foreground">{p.name}</h2>
              <p className="mt-3 flex items-baseline gap-2">
                <span className="font-display text-h2">{p.price}</span>
                {p.unit && <span className="text-small text-muted">{p.unit}</span>}
              </p>
              <p className="mt-2 text-small text-muted">{p.blurb}</p>
              {p.note && <p className="mt-2 text-small text-muted">{p.note}</p>}
              <ul className="mt-6 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="border-t border-line py-2.5 text-small text-muted">
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-col">
                <ButtonLink href={p.cta.href} variant={p.cta.variant}>
                  {p.cta.label}
                </ButtonLink>
              </div>
            </SpotlightCard>
          ))}
        </div>
        <p className="mt-8 max-w-[68ch] text-muted">
          Evaluating first? A short evaluation on a staging environment or a disposable account can be free. Ask on the scope
          call.
        </p>
      </Section>

      <Section id="compare" layout="stack" title="What each plan includes">
        <ComparisonTable
          caption="Plan comparison"
          columns={["Open Source", "Founding Pilot", "Enterprise"]}
          rows={[
            { label: "Price", values: ["Free", "$300 one-time", "Contact us"] },
            { label: "All six commands", values: [true, true, true] },
            { label: "Runs on your machine, no telemetry", values: [true, true, true] },
            { label: "Scope", values: ["Self-serve", "Up to 3 write tools", "By agreement"] },
            { label: "Setup", values: ["Self-serve", "Founder-assisted", "By agreement"] },
            { label: "Contract creation and review", values: [false, true, "By agreement"] },
            { label: "CI job", values: ["Self-serve", "Added via a pull request you merge", "By agreement"] },
            { label: "PASS / FAIL / UNKNOWN reports", values: ["fourgate summary", "Fix report with evidence", "By agreement"] },
            { label: "Review call at day 30", values: [false, true, "By agreement"] },
            { label: "Support", values: ["GitHub issues", "Founder-assisted during the pilot", "By agreement"] },
            { label: "Billing", values: ["None", "Invoiced after the scope call", "By agreement"] },
            { label: "Commitment", values: ["None", "One-time; nothing renews automatically", "By agreement"] },
          ]}
        />
        {GITHUB_URL && (
          <p className="mt-5 text-small text-muted">
            Community support happens in{" "}
            <a href={ISSUES_URL} {...externalProps(ISSUES_URL)} className="link">
              GitHub issues
            </a>
            .
          </p>
        )}
      </Section>

      <Section id="faq" title="Paying for an open-source tool">
        <FAQ items={faq} />
      </Section>

      <CtaBand title="Start with up to three write tools." text={<p>We check them against a test account you create, in your CI.</p>}>
        <ContactCtas />
      </CtaBand>
    </>
  );
}
