import Link from "next/link";
import DraftBadge from "@/components/blog/DraftBadge";
import { Container } from "@/components/Section";
import { posts } from "@/content/blog";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Blog (draft)",
  description: "Draft posts from the Fourgate team.",
  path: "/blog",
  noindex: true,
});

export default function BlogIndex() {
  return (
    <Container className="max-w-[44rem] py-12 sm:py-16">
      <DraftBadge />
      <h1 className="mt-4 font-display text-balance text-[2rem] leading-[1.1] sm:text-[2.5rem]">Blog</h1>
      <p className="mt-4 text-lead text-muted">
        Both posts here are drafts. They are not indexed by search engines and are not linked from the site navigation.
      </p>
      <ul className="mt-10 divide-y divide-line border-y border-line">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link href={`/blog/${p.slug}`} className="block rounded-[8px] py-5 hover:bg-surface">
              <span className="flex flex-wrap items-center gap-3">
                <span className="font-display text-h4 text-foreground">{p.title}</span>
                {p.draft && <DraftBadge />}
              </span>
              <span className="mt-1 block text-small text-muted">{p.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
