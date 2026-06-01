import { NextRequest, NextResponse } from "next/server"
import { runScrapeCycle, getScraperStatus } from "@/lib/scraper"
import { readCandidates } from "@/lib/data-store"

export const dynamic = "force-dynamic"

const SYNC_SECRET = process.env.SYNC_SECRET ?? ""

/**
 * POST /api/sync
 *
 * Triggers an immediate out-of-cycle scrape cycle.
 * Protected by Bearer token — requires the Authorization header:
 *   Authorization: Bearer <SYNC_SECRET>
 *
 * Response:
 *   { triggered: true, newFrame: boolean, framesCollected: number, updatedAt: string }
 *
 * Returns 401 if the secret is missing or wrong.
 * Returns 423 if a scrape cycle is already in progress.
 */
export async function POST(request: NextRequest) {
  // ── Auth check ──────────────────────────────────────────────────────────────
  if (SYNC_SECRET) {
    const authHeader = request.headers.get("authorization") ?? ""
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : ""

    if (token !== SYNC_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
  }

  // ── Check if already scraping ────────────────────────────────────────────────
  const statusBefore = getScraperStatus()
  if (statusBefore.isScraping) {
    return NextResponse.json(
      {
        error: "A sync cycle is already in progress",
        framesCollected: statusBefore.framesCollected,
        totalFrames: statusBefore.totalFrames,
      },
      { status: 423 }
    )
  }

  // ── Run cycle ────────────────────────────────────────────────────────────────
  try {
    const result = await runScrapeCycle()
    const store = readCandidates()

    return NextResponse.json({
      triggered: true,
      newFrame: result.newFrame,
      frameNumber: result.frameNumber,
      framesCollected: result.framesCollected,
      totalFrames: 12,
      updatedAt: store.updatedAt,
    })
  } catch (error) {
    console.error("[/api/sync] Sync cycle failed:", error)
    return NextResponse.json(
      { error: "Sync cycle failed" },
      { status: 500 }
    )
  }
}

/**
 * GET /api/sync
 *
 * Returns current scraper status (no auth required — read-only).
 */
export async function GET() {
  const status = getScraperStatus()
  const store = readCandidates()

  return NextResponse.json({
    ...status,
    candidatesCount: store.candidates.length,
    updatedAt: store.updatedAt,
  })
}
