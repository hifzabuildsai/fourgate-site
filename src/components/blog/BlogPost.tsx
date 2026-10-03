import Link from "next/link";
import type { ReactNode } from "react";
import DraftBadge from "./DraftBadge";
import { postBySlug } from "@/content/blog";

export default function BlogPost({ slug, children }: { slug: string; children: ReactNode }) {
  const post = postBySlug(slug);
  return (
    <article className="mx-auto w-full max-w-[44rem] px-4 py-12 sm:px-8 sm:py-16">
      <p className="text-small">
        <Link href="/blog" className="link">
          Blog
        </Link>
      </p>
      <header className="mt-6">
        {post.draft && <DraftBadge />}
        <h1 className="mt-4 font-display text-balance text-[2rem] leading-[1.1] sm:text-[2.5rem]">{post.title}</h1>
        <p className="mt-4 text-lead text-muted">{post.description}</p>
      </header>
      {post.draft && (
        <div role="note" className="mt-8 rounded-[10px] border border-dashed border-foreground/40 bg-surface p-4 text-small text-muted">
          <p className="font-medium text-foreground">Draft</p>
          <p className="mt-1">
            This post is a draft. It is not indexed by search engines and it is not listed in the site navigation or sitemap.
          </p>
        </div>
      )}
      <div className="mt-6">{children}</div>
    </article>
  );
}
