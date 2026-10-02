import ButtonLink from "@/components/ButtonLink";
import ContactCtas from "@/components/ContactCtas";
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
    "Fourgate is free and open source (MIT). The Founding Design Partner plan is $199/month for one workflow with founder-assisted setup, contract review and a shadow-mode rollout.",
  path: "/pricing",
});

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
    unit: "a month",
    blurb: "We set it up with you on one workflow that matters. Invoiced after the scope call.",
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
    cta: { href: PRIMARY_CTA.href, label: PRIMARY_CTA.label, variant: "primary" },
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Contact us",
    blurb: "More workflows or tools than the design-partner scope.",
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
        The Founding Design Partner plan is invoiced after the scope call. There is no online checkout.
      </p>
    ),
  },
  {
    q: "Can I cancel?",
    a: (
      <p>
        Yes, anytime. The open-source software keeps running on your machines; there is nothing on our side to switch off, and
        your contracts and logs stay with you.
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
        layout="stack"
        rule={false}
        title="Free to run. Paid help to get it right."
        intro={<p>Every plan runs the same open-source software on your infrastructure. What you pay for is our time.</p>}
      >
        <div className="grid lg:grid-cols-3">
          {plans.map((p, i) => (
            <div
              key={p.name}
              className={`flex flex-col border-t py-8 lg:px-8 ${i === 0 ? "lg:pl-0" : ""} ${i === plans.length - 1 ? "lg:pr-0" : ""} ${
                p.featured ? "border-t-2 border-bone lg:bg-surface lg:px-8" : "border-line"
              } ${i > 0 ? "lg:border-l lg:border-l-line" : ""}`}
            >
              <h2 className="text-bone">{p.name}</h2>
              <p className="mt-3 flex items-baseline gap-2">
                <span className="font-display text-h2">{p.price}</span>
                {p.unit && <span className="text-small text-muted">{p.unit}</span>}
              </p>
              <p className="mt-2 text-small text-muted">{p.blurb}</p>
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
            </div>
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
          columns={["Open Source", "Design Partner", "Enterprise"]}
          rows={[
            { label: "Price", values: ["Free", "$199 a month", "Contact us"] },
            { label: "All six commands", values: [true, true, true] },
            { label: "Runs on your machine, no telemetry", values: [true, true, true] },
            { label: "Scope", values: ["Self-serve", "1 workflow, up to 3 tools", "By agreement"] },
            { label: "Setup", values: ["Self-serve", "Founder-assisted", "By agreement"] },
            { label: "Contract creation and review", values: [false, true, "By agreement"] },
            { label: "Shadow-mode rollout", values: ["Self-serve", "Guided", "By agreement"] },
            { label: "PASS / FAIL / UNKNOWN reports", values: ["fourgate summary", "Reviewed with you", "By agreement"] },
            { label: "Weekly review", values: [false, true, "By agreement"] },
            { label: "Support", values: ["GitHub issues", "Direct", "By agreement"] },
            { label: "Billing", values: ["None", "Invoiced after the scope call", "By agreement"] },
            { label: "Commitment", values: ["None", "Monthly, cancel anytime", "By agreement"] },
          ]}
        />
        {GITHUB_URL && (
          <p className="mt-5 text-small text-muted">
            Community support happens in{" "}
            <a href={ISSUES_URL} {...externalProps(ISSUES_URL)} className="text-bone underline decoration-bone/40 underline-offset-4 hover:decoration-bone">
              GitHub issues
            </a>
            .
          </p>
        )}
      </Section>

      <Section id="faq" title="Paying for an open-source tool">
        <FAQ items={faq} />
      </Section>

      <CtaBand title="Start with one workflow." text={<p>Shadow mode first. Your agent sees nothing different while we prove the contracts.</p>}>
        <ContactCtas />
      </CtaBand>
    </>
  );
}
