import ButtonLink from "@/components/ButtonLink";
import Callout from "@/components/Callout";
import CodeBlock from "@/components/CodeBlock";
import ContactCtas from "@/components/ContactCtas";
import CtaBand from "@/components/CtaBand";
import ReportFrame from "@/components/ReportFrame";
import Section from "@/components/Section";
import VerdictSimulator from "@/components/VerdictSimulator";
import { demo, demoCapture } from "@/content/demo";
import { externalProps } from "@/lib/links";
import { pageMetadata } from "@/lib/metadata";
import { DEMO_VIDEO_URL, GITHUB_URL, PYPI_URL } from "@/site.config";

export const metadata = pageMetadata({
  title: "Demo",
  description:
    "The recorded output of fourgate demo: five real MCP sessions against a simulated connector, the guarded ones through a real fourgate guard process. Run it yourself in three commands.",
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
    <Section id="video" layout="stack" title="Watch the demo">
      {selfHosted ? (
        <video controls preload="metadata" className="w-full rounded-[14px] border border-line bg-black" src={DEMO_VIDEO_URL}>
          <a href={DEMO_VIDEO_URL} {...externalProps(DEMO_VIDEO_URL)}>Download the demo video</a>
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
        layout="stack"
        rule={false}
        title="See every verdict, from the real tool."
        intro={
          <p>
            Everything on this page comes from one run of <code className="code-inline">{demoCapture.command}</code> with
            fourgate {demoCapture.version}, installed from PyPI into a fresh virtual environment. The output is split into its
            five scenes and otherwise unchanged, except that two local paths at the end were shortened.
          </p>
        }
      >
        <div className="mb-8 max-w-3xl">
          <Callout title="What this demo is, and is not">
            <p>
              The demo uses a <strong className="text-bone">simulated connector</strong>, and a{" "}
              <strong className="text-bone">local file stands in for the system of record</strong>. It needs no API keys and
              makes no network requests. Each scene is a real MCP session, and scenes S2–S5 run through a real{" "}
              <code>fourgate guard</code> process.
            </p>
          </Callout>
        </div>
        <VerdictSimulator scenes={demo.scenes} preamble={demo.preamble} />

        <details className="mt-6 rounded-[10px] border border-line">
          <summary className="flex cursor-pointer items-center gap-2 px-4 py-3 text-small text-muted hover:text-bone">
            <svg aria-hidden="true" viewBox="0 0 16 16" className="fg-chevron h-3.5 w-3.5">
              <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.4" />
            </svg>
            The complete output, start to finish
          </summary>
          <pre className="fg-scroll max-h-[32rem] overflow-auto border-t border-line bg-[#0a0d12] p-4 font-mono text-[0.75rem] leading-[1.7] text-bone">
            <code className="block whitespace-pre-wrap break-words lg:whitespace-pre">{demo.raw}</code>
          </pre>
        </details>
        <p className="mt-3 text-cap text-muted">
          Paths shortened: the last block originally printed absolute paths on the machine that ran it. Captured{" "}
          {demoCapture.date} on {demoCapture.platform}; exit code 0. Fourgate is tested on Python 3.10–3.13.
        </p>
      </Section>

      <Section
        id="run"
        title="Run it yourself."
        intro={<p>Three commands in a fresh virtual environment. Python 3.10–3.13, Linux or Windows. The demo itself needs no API keys and no network.</p>}
      >
        <div className="grid gap-4">
          <CodeBlock code={linux} label="Linux (bash)" prompt />
          <CodeBlock code={windows} label="Windows PowerShell" prompt />
        </div>
        <p className="prose-fg mt-5 text-small text-muted">
          If the <code>fourgate</code> command is not found on PATH, <code>python -m fourgate demo</code> works the same way.
          The run writes a local summary page to <code>./fourgate-demo/fourgate-demo-summary.html</code>. Add{" "}
          <code>--pace 2</code> to slow it down for a screen recording.
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
        layout="stack"
        title="The real sample report"
        intro={
          <p>
            This is the <code className="code-inline">fourgate-demo-summary.html</code> page the run above produced, copied byte
            for byte. It has no JavaScript and makes no network requests, and contains structure only: no arguments, record
            values, response bodies or credentials. Its numbers come from the simulated demo, not customer traffic.
          </p>
        }
      >
        <ReportFrame />
      </Section>

      <CtaBand title="Ready to try it on a real workflow?" text={<p>Start in shadow mode on a disposable account. Your agent sees nothing different.</p>}>
        <ContactCtas />
      </CtaBand>
    </>
  );
}
