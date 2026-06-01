/**
 * instrumentation.ts
 *
 * Next.js built-in hook — called ONCE when the server process starts.
 * We use it to kick off the background Puppeteer scraper loop so it runs
 * automatically without any external cron or manual trigger.
 *
 * Docs: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
  // Only run in the Node.js runtime (not in the Edge runtime)
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startScraperLoop } = await import("./lib/scraper")
    startScraperLoop()
  }
}
