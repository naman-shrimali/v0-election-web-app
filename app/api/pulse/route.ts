import { NextResponse } from "next/server"
import { readCandidates } from "@/lib/data-store"
import { getScraperStatus, SCRAPE_INTERVAL_MS } from "@/lib/scraper"

export const dynamic = "force-dynamic"

// ─── Previously: proxy to election_backend /api/pulse (AES-256-CBC encrypted) ─
//
// const BACKEND_URL = process.env.ELECTION_BACKEND_URL ?? "http://localhost:5001"
//
// export async function GET() {
//   try {
//     const response = await fetch(`${BACKEND_URL}/api/pulse`, { cache: "no-store" })
//     if (!response.ok) {
//       const body = await response.text()
//       return NextResponse.json(
//         { error: `Backend returned ${response.status}`, detail: body },
//         { status: response.status }
//       )
//     }
//     const encryptedData = await response.json()
//     return NextResponse.json(encryptedData, { headers: { "Cache-Control": "no-store, max-age=0" } })
//   } catch (error) {
//     console.error("Failed to reach election backend for pulse", error)
//     return NextResponse.json({ error: "Unable to fetch live results" }, { status: 502 })
//   }
// }
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/pulse
 *
 * Returns live election candidate data read from the local data/results.json
 * file, which is kept up-to-date by the background Puppeteer scraper.
 *
 * Response shape:
 * {
 *   candidates: Candidate[],
 *   updatedAt: string,        // ISO timestamp of last successful scrape
 *   framesCollected: number,  // how many of the 12 frames have been scraped
 *   totalFrames: number,      // 12
 *   nextRefreshInMs: number   // ms until the next scrape cycle
 * }
 */
export async function GET() {
  try {
    const store = readCandidates()
    const status = getScraperStatus()

    return NextResponse.json(
      {
        candidates: store.candidates,
        updatedAt: store.updatedAt,
        framesCollected: store.framesCollected,
        totalFrames: store.totalFrames,
        nextRefreshInMs: status.nextScrapeInMs ?? SCRAPE_INTERVAL_MS,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    )
  } catch (error) {
    console.error("[/api/pulse] Failed to read candidates:", error)
    return NextResponse.json(
      { error: "Unable to fetch live results" },
      { status: 500 }
    )
  }
}
