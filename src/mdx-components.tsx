import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import type { ComponentProps, ReactElement, ReactNode } from "react";
import Callout from "@/components/Callout";
import CodeBlock from "@/components/CodeBlock";
import StatusBadge from "@/components/StatusBadge";
import { externalProps, isExternal } from "@/lib/links";
import { slugify } from "@/lib/slug";

/** Plain text of a React subtree (for heading ids and code-block bodies). */
function textOf(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  return textOf((node as ReactElement<{ children?: ReactNode }>).props?.children);
}

const LANG_LABEL: Record<string, string> = {
  bash: "Shell",
  sh: "Shell",
  powershell: "PowerShell",
  json: "JSON",
  yaml: "YAML",
  text: "Text",
};

function Heading({ level, children }: { level: 2 | 3; children?: ReactNode }) {
  const id = slugify(textOf(children));
  const Tag = level === 2 ? "h2" : "h3";
  return (
    <Tag
      id={id}
      className={`group scroll-mt-20 font-display text-balance ${
        level === 2 ? "mt-14 border-t border-line pt-10 text-[1.5rem] leading-[1.2] sm:text-h3" : "mt-9 text-h4"
      }`}
    >
      {children}
      <a
        href={`#${id}`}
        className="ml-2 rounded-[4px] text-muted opacity-0 hover:text-foreground focus-visible:opacity-100 group-hover:opacity-100"
        aria-label={`Link to section: ${textOf(children)}`}
      >
        #
      </a>
    </Tag>
  );
}

function Anchor({ href = "", children, ...rest }: ComponentProps<"a">) {
  if (isExternal(href)) {
    return (
      <a href={href} className="link" {...externalProps(href)} {...rest}>
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  if (href.startsWith("/") && !href.endsWith(".html")) {
    return (
      <Link href={href} className="link">
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className="link" {...rest}>
      {children}
    </a>
  );
}

/** Fenced code becomes the site's CodeBlock (copy button included). */
function Pre({ children }: ComponentProps<"pre">) {
  const code = children as ReactElement<{ className?: string; children?: ReactNode }>;
  const lang = /language-(\w+)/.exec(code?.props?.className ?? "")?.[1] ?? "text";
  const body = textOf(code?.props?.children).replace(/\n$/, "");
  return (
    <CodeBlock
      className="my-5"
      code={body}
      label={LANG_LABEL[lang] ?? lang}
      prompt={lang === "bash"}
      maxHeight={body.split("\n").length > 40 ? "28rem" : undefined}
    />
  );
}

/** Inline verdict chip: <V s="PASS" /> */
export function V({ s }: { s: "PASS" | "FAIL" | "UNKNOWN" }) {
  return <StatusBadge status={s} size="sm" />;
}

const components: MDXComponents = {
  h2: (p) => <Heading level={2} {...p} />,
  h3: (p) => <Heading level={3} {...p} />,
  p: (p) => <p className="mt-4 max-w-[68ch] text-body text-foreground/90" {...p} />,
  ul: (p) => <ul className="mt-4 max-w-[68ch] list-disc space-y-1.5 pl-6 marker:text-muted" {...p} />,
  ol: (p) => <ol className="mt-4 max-w-[68ch] list-decimal space-y-1.5 pl-6 marker:text-muted" {...p} />,
  li: (p) => <li className="pl-1 text-foreground/90" {...p} />,
  a: Anchor,
  strong: (p) => <strong className="font-semibold text-foreground" {...p} />,
  code: ({ className, ...p }) => (className ? <code className={className} {...p} /> : <code className="code-inline" {...p} />),
  pre: Pre,
  blockquote: (p) => <blockquote className="mt-4 max-w-[68ch] border-l-2 border-line-strong pl-4 text-muted" {...p} />,
  hr: () => <hr className="my-10 border-line" />,
  table: (p) => (
    <div className="fg-scroll my-5 overflow-x-auto rounded-[10px] border border-line" tabIndex={0} role="region" aria-label="Table">
      <table className="w-full min-w-[34rem] border-collapse text-left text-small" {...p} />
    </div>
  ),
  thead: (p) => <thead className="bg-surface" {...p} />,
  th: (p) => <th scope="col" className="border-b border-line px-3 py-2 align-bottom font-medium text-foreground" {...p} />,
  td: (p) => <td className="border-t border-line px-3 py-2 align-top text-foreground/90" {...p} />,
  Callout,
  CodeBlock,
  V,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
