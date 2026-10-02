import type { CSSProperties, ReactNode } from "react";

/**
 * Wrapped code lines: break at spaces, never inside a flag or a short word
 * (a hyphen is otherwise a break opportunity), and indent continuation lines
 * two columns past the line's own indent. Text content is unchanged.
 */
const SHORT = 32;

export function hangStyle(line: string): CSSProperties {
  const n = line.length - line.trimStart().length + 2;
  return { paddingLeft: `${n}ch`, textIndent: `-${n}ch` };
}

export function noBreak(text: string): ReactNode[] {
  return text.split(/(\s+)/).map((tok, i) =>
    tok && !/^\s/.test(tok) && (tok.length <= SHORT || tok.startsWith("-")) ? (
      <span key={i} className="whitespace-nowrap">
        {tok}
      </span>
    ) : (
      tok
    ),
  );
}
