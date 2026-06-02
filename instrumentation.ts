/**
 * instrumentation.ts
 *
 * Next.js built-in hook — called once when the server process starts.
 *
 * Previously: kicked off a background Puppeteer scraper loop inside Next.js.
 * Now:        no-op. All scraping runs in election_backend (Heroku), which is
 *             a persistent Express process that can run Puppeteer continuously.
 *             This Next.js app (Vercel) only proxies + decrypts the results.
 *
 * Docs: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
  // Scraping is handled by election_backend (Heroku).
  // No background process is needed here.
}
