import ButtonLink from "@/components/ButtonLink";
import Callout from "@/components/Callout";
import CodeBlock from "@/components/CodeBlock";
import CtaBand from "@/components/CtaBand";
import Section from "@/components/Section";
import Terminal from "@/components/Terminal";
import { demo, demoCapture } from "@/content/demo";
import { pageMetadata } from "@/lib/metadata";
import { DEMO_VIDEO_URL, GITHUB_URL, PYPI_URL } from "@/site.config";

export const metadata = pageMetadata({
  title: "Demo",
  description:
    "The exact output of fourgate demo: five real MCP sessions against a simulated connector, the guarded ones through a real fourgate guard process. Run it yourself in three commands.",
  path: "/demo",
});

const linux = `python3 -m venv fourgate-env
fourgate-env/bin/python -m pip install fourgate
fourgate-env/bin/fourgate demo`;

const windows = `python -m venv fourgate-env
fourgate-env\\Scripts\\python -m pip install fourgate
fourgate-env\\Scripts\\fourgate demo`;

function Video() {
  if (!DEMO_VIDEO_URL) return null;
  const selfHosted = /\.(mp4|webm)(\?.*)?$/i.test(DEMO_VIDEO_URL);
  return (
    <Section id="video" eyebrow="Video" title="Watch the demo" className="border-t border-border">
      {selfHosted ? (
        <video controls preload="metadata" className="w-full rounded-xl border border-border bg-black" src={DEMO_VIDEO_URL}>
          <a href={DEMO_VIDEO_URL}>Download the demo video</a>
        </video>
      ) : (
        <ButtonLink href={DEMO_VIDEO_URL} variant="secondary">
          Watch the demo video
        </ButtonLink>
      )}
    </Section>
  );
}

export default function DemoPage() {
  return (
    <>
      <Section
        id="top"
        as="h1"
        eyebrow="Demo"
        title="See every verdict, from the real tool."
        intro={
          <>
            <p>
              Below is the exact output of <code className="font-mono text-text">{demoCapture.command}</code> from fourgate{" "}
              {demoCapture.version}, installed from PyPI into a fresh virtual environment. It is split into its five scenes;
              nothing else is changed.
            </p>
          </>
        }
      >
        <Callout tone="honest" title="What this demo is, and is not">
          <p>
            The demo uses a <strong>simulated connector</strong>, and a <strong>local file stands in for the system of
            record</strong>. It needs no API keys and makes no network requests. Each scene is a real MCP session, and
            scenes S2–S5 run through a real <code>fourgate guard</code> process.
          </p>
        </Callout>

        <div className="mt-10 space-y-6">
          <div className="rounded-xl border border-border bg-[#07090b] p-4 sm:p-5">
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.14em] text-subtle">Start of output</p>
            <pre className="overflow-x-auto font-mono text-[0.75rem] leading-[1.7] text-muted sm:text-[0.8125rem]">
              <code className="block whitespace-pre-wrap break-words lg:whitespace-pre">{demo.preamble}</code>
            </pre>
          </div>

          <Terminal tabs={demo.scenes} title={`$ ${demoCapture.command}`} />

          <div className="rounded-xl border border-border bg-[#07090b] p-4 sm:p-5">
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.14em] text-subtle">End of output</p>
            <pre className="overflow-x-auto font-mono text-[0.75rem] leading-[1.7] text-muted sm:text-[0.8125rem]">
              <code className="block whitespace-pre-wrap break-all lg:whitespace-pre lg:break-normal">{demo.summary}</code>
            </pre>
          </div>
          <p className="text-xs text-subtle">
            Captured {demoCapture.date} on {demoCapture.platform}; exit code 0. Fourgate is tested on Python 3.10–3.13. The
            paths at the end are where that run wrote its files.
          </p>
        </div>
      </Section>

      <Section
        id="run"
        eyebrow="Run it yourself"
        title="Three commands, in a fresh virtual environment."
        intro={<p>Python 3.10–3.13, Linux or Windows. No API keys, no network access needed for the demo itself.</p>}
        className="border-t border-border"
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <CodeBlock code={linux} label="Linux (bash)" prompt />
          <CodeBlock code={windows} label="Windows PowerShell" prompt />
        </div>
        <p className="mt-5 text-sm leading-relaxed text-muted">
          If the <code className="font-mono text-text">fourgate</code> command is not found on PATH,{" "}
          <code className="font-mono text-text">python -m fourgate demo</code> works the same way. The run writes a local
          summary page to <code className="font-mono text-text">./fourgate-demo/fourgate-demo-summary.html</code>. Add{" "}
          <code className="font-mono text-text">--pace 2</code> to slow it down for a screen recording.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href={PYPI_URL} variant="secondary">
            fourgate on PyPI
          </ButtonLink>
          <ButtonLink href={GITHUB_URL} variant="secondary">
            Source on GitHub
          </ButtonLink>
        </div>
      </Section>

      <Video />

      <Section
        id="report"
        eyebrow="Sample report"
        title="Open the real sample report"
        intro={
          <p>
            This is the <code className="font-mono text-text">fourgate-demo-summary.html</code> page that the run above
            produced, copied byte for byte. It has no JavaScript and makes no network requests. Like the outcome log, it
            contains structure only: no arguments, record values, response bodies or credentials.
          </p>
        }
        className="border-t border-border"
      >
        <div className="overflow-hidden rounded-xl border border-border">
          <iframe
            src="/sample-report.html"
            title="Fourgate demo outcome summary (sample report)"
            className="block h-[44rem] w-full bg-surface"
            loading="lazy"
          />
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <ButtonLink href="/sample-report.html" variant="secondary">
            Open the sample report on its own page
          </ButtonLink>
        </div>
        <p className="mt-4 text-sm text-muted">
          Reminder: these numbers come from the simulated demo (a simulated connector and a local file as the system of
          record), not from customer traffic.
        </p>
      </Section>

      <CtaBand
        title="Ready to try it on a real workflow?"
        text={<p>Start in shadow mode on a disposable account. Your agent sees nothing different.</p>}
      >
        <ButtonLink href="/design-partner">Become a design partner</ButtonLink>
        <ButtonLink href="/integrations" variant="secondary">
          See integrations
        </ButtonLink>
      </CtaBand>
    </>
  );
}
