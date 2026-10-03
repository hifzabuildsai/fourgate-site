"use client";

import { ThemeProvider as NextThemes } from "next-themes";
import type { ReactNode } from "react";

/** Class-based theming; follows the system until the visitor picks, then remembers it. */
export default function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemes attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange storageKey="fourgate-theme">
      {children}
    </NextThemes>
  );
}
