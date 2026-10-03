import type { Metadata } from "next";

// Every /blog page is a draft for now: keep it out of search indexes.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
