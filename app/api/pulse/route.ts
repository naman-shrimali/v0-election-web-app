import { NextResponse } from "next/server"
import { decryptPayload } from "@/lib/crypto"

export const dynamic = "force-dynamic"

// ─── Config ───────────────────────────────────────────────────────────────────

const BACKEND_URL =
  process.env.ELECTION_BACKEND_URL ?? "http://localhost:5001"

const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET ?? ""

// How long the frontend countdown should run between its own fetches.
// This doesn't control the backend scrape rate — it just keeps the UI in sync.
const CLIENT_REFRESH_MS = 30_000

// ─── Route ────────────────────────────────────────────────────────────────────

/**
 * GET /api/pulse
 *
 * Proxies to election_backend /api/pulse, decrypts the AES-256-CBC payload,
 * and returns plain JSON to the browser.
 *
 * Response shape:
 * {
 *   candidates: Candidate[],
 *   updatedAt: string,
 *   framesCollected: number,
 *   totalFrames: number,
 *   nextRefreshInMs: number
 * }
 */
export async function GET() {
  if (!ENCRYPTION_SECRET) {
    console.error("[/api/pulse] ENCRYPTION_SECRET is not set")
    return NextResponse.json(
      { error: "Server misconfiguration — encryption secret missing" },
      { status: 500 }
    )
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/pulse`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(15_000), // 15s timeout
    })

    if (!response.ok) {
      const body = await response.text()
      console.error(`[/api/pulse] Backend returned ${response.status}: ${body}`)
      return NextResponse.json(
        { error: `Backend returned ${response.status}`, detail: body },
        { status: response.status }
      )
    }

    const { payload, ts } = (await response.json()) as {
      payload: string
      ts: string
    }

    // Decrypt the AES-256-CBC payload — runs server-side only
    const data = decryptPayload<{
      candidates: unknown[]
      updatedAt: string
      framesCollected: number
      totalFrames: number
    }>(payload, ENCRYPTION_SECRET)

    return NextResponse.json(
      {
        candidates: data.candidates,
        updatedAt: data.updatedAt ?? ts,
        framesCollected: data.framesCollected,
        totalFrames: data.totalFrames,
        nextRefreshInMs: CLIENT_REFRESH_MS,
      },
      {
        headers: { "Cache-Control": "no-store, max-age=0" },
      }
    )
  } catch (error) {
    console.error("[/api/pulse] Failed to reach election backend:", error)
    return NextResponse.json(
      { error: "Unable to fetch live results — backend unreachable" },
      { status: 502 }
    )
  }
}
