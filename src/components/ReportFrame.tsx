import ButtonLink from "./ButtonLink";

/** The demo's real summary page in a framed, scrollable window. */
export default function ReportFrame() {
  return (
    <div className="overflow-hidden rounded-[14px] border border-line">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface px-4 py-2.5">
        <span className="font-mono text-cap text-muted">fourgate-demo-summary.html</span>
        <ButtonLink href="/sample-report.html" variant="secondary" className="min-h-9">
          Open full report
        </ButtonLink>
      </div>
      <iframe
        src="/sample-report.html"
        title="Fourgate demo outcome summary (sample report)"
        className="block h-[34rem] w-full bg-night sm:h-[40rem]"
      />
    </div>
  );
}
