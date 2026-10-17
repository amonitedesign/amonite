export interface WaitlistEntry {
  email: string;
  /** Discipline, e.g. "Interior Designer" (the modal's `role`). */
  role: string;
  /** Tier label, e.g. "Pro" | "Studio" | "Early Access". */
  tier: string;
}

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

/** Playwright/automation sets `navigator.webdriver` — never send real leads from tests. */
function isAutomated(): boolean {
  return typeof navigator !== 'undefined' && navigator.webdriver === true;
}

/**
 * Fan out a waitlist entry to every configured sink. Best-effort: a missing
 * endpoint is skipped, and one failing sink never blocks the other or throws.
 *
 * Sinks (both optional, both client-side, no backend):
 * - Web3Forms → email notification to the account inbox (Option 1).
 * - Google Apps Script web app → appends a row to a Google Sheet (Option 2).
 */
export async function submitWaitlistEntry(entry: WaitlistEntry): Promise<void> {
  if (isAutomated()) return;

  const timestamp = new Date().toISOString();
  const { email, role, tier } = entry;
  const jobs: Array<Promise<unknown>> = [];

  const web3formsKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
  if (web3formsKey) {
    jobs.push(
      fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: web3formsKey,
          from_name: 'Amonite Studio',
          subject: `Amonite waitlist — ${tier} — ${role}`,
          email,
          discipline: role,
          tier,
          timestamp,
        }),
      })
    );
  }

  const sheetWebhook = process.env.NEXT_PUBLIC_WAITLIST_SHEET_URL;
  if (sheetWebhook) {
    jobs.push(
      fetch(sheetWebhook, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timestamp, email, role, plan: tier }),
      })
    );
  }

  const results = await Promise.allSettled(jobs);
  for (const result of results) {
    if (result.status === 'rejected') {
      console.warn('Waitlist sync warning:', result.reason);
    }
  }
}
