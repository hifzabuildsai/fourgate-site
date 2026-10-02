import ButtonLink from "@/components/ButtonLink";
import Callout from "@/components/Callout";
import ComparisonTable from "@/components/ComparisonTable";
import CtaBand from "@/components/CtaBand";
import FAQ, { type FaqItem } from "@/components/FAQ";
import Section from "@/components/Section";
import { pageMetadata } from "@/lib/metadata";
import { BOOKING_URL, CONTACT_EMAIL, GITHUB_URL, ISSUES_URL, PAYMENT_URL } from "@/site.config";

export const metadata = pageMetadata({
  title: "Pricing",
  description:
    "Fourgate is free and open source (MIT). The Founding Design Partner plan is $199/month for one workflow with founder-assisted setup, contract review and a shadow-mode rollout.",
  path: "/pricing",
});

const contactHref = BOOKING_URL || (CONTACT_EMAIL ? `mailto:${CONTACT_EMAIL}` : "/design-partner");

type Plan = {
  name: string;
  price: string;
  unit?: string;
  blurb: string;
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
    name: "Founding Design Partner",
    price: "$199",
    unit: "/month",
    blurb: "We set it up with you on one workflow that matters.",
    features: [
      "One workflow, up to three consequential state-changing tools",
      "Founder-assisted setup",
      "Contract creation and review",
      "Shadow-mode rollout",
      "PASS / FAIL / UNKNOWN reports",
      "Direct support",
      "Weekly review",
      "Cancel anytime",
    ],
    cta: { href: PAYMENT_URL || "/design-partner", label: "Become a design partner", variant: "primary" },
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Contact",
    blurb: "More workflows or tools than the design-partner scope.",
    features: ["Same open-source software, on your infrastructure", "Scope and terms by agreement"],
    cta: { href: contactHref, label: "Contact us", variant: "secondary" },
  },
];

const faq: FaqItem[] = [
  {
    q: "Why is there no usage metering?",
    a: (
      <p>
        Fourgate runs on your machines and sends no telemetry, so there is nothing for us to meter, and we would rather keep
        it that way. You pay for help on a workflow, not per call.
      </p>
    ),
  },
  {
    q: "What counts as a tool?",
    a: (
      <p>
        A consequential, state-changing MCP tool that you protect with an outcome contract, for example a tool that creates
        an issue or sends an email. Tools without a contract are not checked and do not count.
      </p>
    ),
  },
  {
    q: "Can I cancel?",
    a: (
      <p>
        Yes, anytime. The open-source software keeps running on your machines; there is nothing on our side to switch off,
        and your contracts and logs stay with you.
      </p>
    ),
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
        eyebrow="Pricing"
        title="Free to run. Paid help to get it right."
        intro={<p>Every plan runs the same open-source software on your infrastructure. What you pay for is our time.</p>}
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`flex flex-col rounded-2xl border bg-surface p-6 sm:p-7 ${
                p.featured ? "border-accent/60 shadow-[0_0_0_1px_var(--accent)_inset]" : "border-border"
              }`}
            >
              <h2 className="font-semibold text-text">{p.name}</h2>
              <p className="mt-3 flex items-baseline gap-1">
                <span className="font-mono text-3xl font-semibold">{p.price}</span>
                {p.unit && <span className="text-sm text-muted">{p.unit}</span>}
              </p>
              <p className="mt-2 text-sm text-muted">{p.blurb}</p>
              <ul className="mt-6 flex-1 space-y-2.5">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2.5 text-sm text-muted">
                    <svg aria-hidden="true" viewBox="0 0 16 16" className="mt-0.5 h-4 w-4 shrink-0 text-accent">
                      <path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex flex-col">
                <ButtonLink href={p.cta.href} variant={p.cta.variant}>
                  {p.cta.label}
                </ButtonLink>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <Callout tone="note" title="Evaluating first?">
            <p>A short evaluation on a staging environment or a disposable account can be free. Ask on the scope call.</p>
          </Callout>
        </div>
      </Section>

      <Section id="compare" eyebrow="Compare" title="What each plan includes" className="border-t border-border">
        <ComparisonTable
          caption="Plan comparison"
          columns={["Open Source", "Design Partner", "Enterprise"]}
          rows={[
            { label: "Price", values: ["Free", "$199/month", "Contact"] },
            { label: "All six commands", values: [true, true, true] },
            { label: "Runs on your machine, no telemetry", values: [true, true, true] },
            { label: "Scope", values: ["Self-serve", "1 workflow, up to 3 tools", "By agreement"] },
            { label: "Setup", values: ["Self-serve", "Founder-assisted", "By agreement"] },
            { label: "Contract creation and review", values: [false, true, "By agreement"] },
            { label: "Shadow-mode rollout", values: ["Self-serve", "Guided", "By agreement"] },
            { label: "PASS / FAIL / UNKNOWN reports", values: ["fourgate summary", "Reviewed with you", "By agreement"] },
            { label: "Weekly review", values: [false, true, "By agreement"] },
            { label: "Support", values: ["GitHub issues", "Direct", "By agreement"] },
            { label: "Commitment", values: ["None", "Monthly, cancel anytime", "By agreement"] },
          ]}
        />
        {GITHUB_URL && (
          <p className="mt-4 text-sm text-muted">
            Community support happens in{" "}
            <a href={ISSUES_URL} className="text-accent underline underline-offset-2" target="_blank" rel="noopener noreferrer">
              GitHub issues<span className="sr-only"> (opens in a new tab)</span>
            </a>
            .
          </p>
        )}
      </Section>

      <Section id="faq" eyebrow="Pricing FAQ" title="Questions about paying for an open-source tool" className="border-t border-border">
        <div className="max-w-3xl">
          <FAQ items={faq} />
        </div>
      </Section>

      <CtaBand title="Start with one workflow." text={<p>Shadow mode first. Your agent sees nothing different while we prove the contracts.</p>}>
        <ButtonLink href="/design-partner">Become a design partner</ButtonLink>
        <ButtonLink href="/demo" variant="secondary">
          Run the demo
        </ButtonLink>
      </CtaBand>
    </>
  );
}
