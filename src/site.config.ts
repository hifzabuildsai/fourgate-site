// Site-wide links and contact details. Leave a value as "" to hide the CTA
// or link that depends on it; every component degrades gracefully when empty.

export const SITE_URL = "https://fourgate-site.vercel.app";
export const SITE_NAME = "Fourgate";

/** Public contact address, e.g. "hello@example.com". Shown in the footer, privacy page and design-partner CTAs. */
export const CONTACT_EMAIL = "hifzabuild.ai@gmail.com";
/** Scheduling link for a 30-minute scope call. */
export const BOOKING_URL = "https://cal.com/fourgate/fourgate-scope-call";
/** Checkout link for the Founding Design Partner plan. Empty: the plan is invoiced after the scope call. */
export const PAYMENT_URL = "";
/** Product source repository. */
export const GITHUB_URL = "https://github.com/hifzabuildsai/fourgate";
/** Package page on PyPI. */
export const PYPI_URL = "https://pypi.org/project/fourgate/";
/** A self-hosted .mp4/.webm file renders inline; any other URL renders as a link. */
export const DEMO_VIDEO_URL = "";
export const LINKEDIN_URL = "";
export const X_URL = "";

// Derived links into the product repository.
export const RELEASES_URL = `${GITHUB_URL}/releases`;
export const RELEASE_URL = `${GITHUB_URL}/releases/tag/v0.3.0`;
export const README_URL = `${GITHUB_URL}#readme`;
export const SECURITY_MD_URL = `${GITHUB_URL}/blob/main/SECURITY.md`;
export const PILOT_MD_URL = `${GITHUB_URL}/blob/main/PILOT.md`;
export const ISSUES_URL = `${GITHUB_URL}/issues`;

export const VERSION = "0.3.0";

// Calls to action. Primary: book the scope call; secondary: email.
export const PRIMARY_CTA = { href: BOOKING_URL || "/design-partner", label: "Book a 30-minute scope call" };
export const EMAIL_HREF = CONTACT_EMAIL ? `mailto:${CONTACT_EMAIL}` : "";
