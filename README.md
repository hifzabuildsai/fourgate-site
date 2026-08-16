# Fourgate — landing site

Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 + Framer Motion.

The marketing/demo site for [Fourgate](https://github.com/hifzabuildsai/fourgate), the MCP
connector preflight checker.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

Push this to its own GitHub repo, then import it at [vercel.com/new](https://vercel.com/new) —
Vercel detects Next.js automatically, no config needed. Or from the CLI:

```bash
npm i -g vercel
vercel
```

## What's real vs. illustrative

- The **terminal report** in the hero replays the *actual* captured output of running
  `checker/preflight.py` against the two fixture servers in the main
  [fourgate repo](https://github.com/hifzabuildsai/fourgate) — not fabricated.
- The **scrolling ledger** and the **comparison table** are labeled honestly in the UI: the
  ledger cycles through real check *types*, not live usage data (there is no usage data yet),
  and the comparison table reflects the actual research done on MCP Inspector and MCPTrust.
- No "backed by" badge, no fake metrics. Don't add either until they're true.

## Structure

```
src/
  app/
    layout.tsx      fonts + metadata
    page.tsx         assembles all sections
    globals.css      design tokens (Tailwind v4 @theme)
  components/
    BackgroundMesh.tsx   drifting blobs + grid
    Nav.tsx
    Hero.tsx             terminal replay + scroll parallax
    Ledger.tsx           scrolling check ticker
    Gates.tsx            four invariants, staggered reveal
    Compare.tsx          honest comparison table
    WhyCtaFooter.tsx      why / CTA / footer
```
