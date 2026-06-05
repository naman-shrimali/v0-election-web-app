import { NextResponse } from "next/server"
import { decryptPayload } from "@/lib/crypto"

export const dynamic = "force-dynamic"

// ─── Config ───────────────────────────────────────────────────────────────────

const BACKEND_URL =
  process.env.ELECTION_BACKEND_URL ?? "http://localhost:5001"

const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET ?? ""

// Browser-side countdown timer interval (ms). Does NOT control the backend
// scrape rate — the backend polls every 10s independently.
const CLIENT_REFRESH_MS = 30_000

// ─── Route ────────────────────────────────────────────────────────────────────

/**
 * GET /api/pulse
 *
 * Proxies to election_backend /api/pulse and passes the response through.
 *
 * The backend always returns HTTP 200 with a `status` field:
 *
 *   status = "warming_up"
 *     → Scraper hasn't finished its first cycle yet.
 *       We pass through the body as-is so the browser can show a loading state.
 *       Body includes `scraper` with full diagnostic (lifecycle, errors, etc.).
 *
 *   status = "ok"
 *     → Decrypts the AES-256-CBC payload server-side, returns plain JSON.
 *
 *   status = "error"
 *     → Backend had an internal problem. Pass through with diagnostic.
 *
 * Browser-facing response shape:
 * {
 *   status:          "ok" | "warming_up" | "error",
 *   candidates:      Candidate[],           // [] during warming_up / error
 *   updatedAt:       string | null,
 *   framesCollected: number,
 *   totalFrames:     number,
 *   nextRefreshInMs: number,
 *   scraper?:        ScraperStatus,         // always present for debug
 * }
 */
export async function GET() {
  if (!ENCRYPTION_SECRET) {
    console.error("[/api/pulse] ENCRYPTION_SECRET is not set")
    return NextResponse.json(
      {
        status: "error",
        code: "MISCONFIGURATION",
        message: "Server misconfiguration — ENCRYPTION_SECRET is missing on this Vercel deployment.",
        candidates: [],
        framesCollected: 0,
        totalFrames: 12,
        updatedAt: null,
        nextRefreshInMs: CLIENT_REFRESH_MS,
      },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    )
  }

  let backendJson: Record<string, unknown>

  try {
    const response = await fetch(`${BACKEND_URL}/api/pulse`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(15_000),
    })

    backendJson = await response.json()
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error("[/api/pulse] Cannot reach election backend:", msg)
    return NextResponse.json(
      {
        status: "error",
        code: "BACKEND_UNREACHABLE",
        message: `Election backend is not responding. Check that ELECTION_BACKEND_URL (${BACKEND_URL}) is correct and the Heroku dyno is awake.`,
        detail: msg,
        candidates: [],
        framesCollected: 0,
        totalFrames: 12,
        updatedAt: null,
        nextRefreshInMs: CLIENT_REFRESH_MS,
      },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    )
  }

  const backendStatus = backendJson.status as string

  // ── Warming up or backend-side error: pass through without decrypting ────────
  if (backendStatus !== "ok") {
    return NextResponse.json(
      {
        status: backendStatus,
        code: backendJson.code ?? null,
        message: backendJson.message ?? null,
        scraper: backendJson.scraper ?? null,
        candidates: [],
        framesCollected: (backendJson.framesCollected as number) ?? 0,
        totalFrames: (backendJson.totalFrames as number) ?? 12,
        updatedAt: null,
        nextRefreshInMs: CLIENT_REFRESH_MS,
      },
      { headers: { "Cache-Control": "no-store" } }
    )
  }

  // ── Normal path: decrypt AES-256-CBC payload ─────────────────────────────────
  try {
    const { payload, ts } = backendJson as { payload: string; ts: string }

    const data = decryptPayload<{
      candidates: unknown[]
      updatedAt: string
      framesCollected: number
      totalFrames: number
    }>(payload, ENCRYPTION_SECRET)

    return NextResponse.json(
      {
        status: "ok",
        candidates: data.candidates,
        updatedAt: data.updatedAt ?? ts,
        framesCollected: data.framesCollected,
        totalFrames: data.totalFrames,
        nextRefreshInMs: CLIENT_REFRESH_MS,
        scraper: backendJson.scraper ?? null,
      },
      { headers: { "Cache-Control": "no-store" } }
    )
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error("[/api/pulse] Decryption failed:", msg)
    return NextResponse.json(
      {
        status: "error",
        code: "DECRYPTION_FAILED",
        message: `Payload decryption failed — ENCRYPTION_SECRET on Vercel likely doesn't match the one on Heroku. Detail: ${msg}`,
        candidates: [],
        framesCollected: 0,
        totalFrames: 12,
        updatedAt: null,
        nextRefreshInMs: CLIENT_REFRESH_MS,
      },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    )
  }
}
