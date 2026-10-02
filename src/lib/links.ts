/** True for links that leave this site (http/https to another origin). */
export function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href);
}

/** Attributes for links that leave the site: open in a new tab, no opener, no referrer. */
export function externalProps(href: string) {
  return isExternal(href) ? ({ target: "_blank", rel: "noopener noreferrer" } as const) : {};
}
