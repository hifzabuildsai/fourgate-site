import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  output: "export",
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  images: { unoptimized: true },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
