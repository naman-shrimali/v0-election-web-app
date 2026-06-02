import { NextResponse } from "next/server"
import { decryptPayload } from "@/lib/crypto"

export const dynamic = "force-dynamic"

// ─── Config ───────────────────────────────────────────────────────────────────

const BACKEND_URL =
  process.env.ELECTION_BACKEND_URL ?? "http://localhost:5001"

const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET ?? ""

// ─── Route ────────────────────────────────────────────────────────────────────

/**
 * GET /api/signal
 *
 * Proxies to election_backend /api/signal, decrypts the AES-256-CBC payload,
 * and returns plain JSON to the browser.
 *
 * Response shape:
 * {
 *   notice: {
 *     text: string,
 *     maintenanceMode: boolean,
 *     updatedAt: string
 *   }
 * }
 */
export async function GET() {
  if (!ENCRYPTION_SECRET) {
    console.error("[/api/signal] ENCRYPTION_SECRET is not set")
    return NextResponse.json(
      { error: "Server misconfiguration — encryption secret missing" },
      { status: 500 }
    )
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/signal`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(15_000),
    })

    if (!response.ok) {
      const body = await response.text()
      console.error(`[/api/signal] Backend returned ${response.status}: ${body}`)
      return NextResponse.json(
        { error: `Backend returned ${response.status}`, detail: body },
        { status: response.status }
      )
    }

    const { payload, ts } = (await response.json()) as {
      payload: string
      ts: string
    }

    // Decrypt server-side — secret never reaches the browser
    const notice = decryptPayload<{
      text: string
      maintenanceMode: boolean
      updatedAt: string
    }>(payload, ENCRYPTION_SECRET)

    return NextResponse.json(
      {
        notice: {
          text: notice.text,
          maintenanceMode: notice.maintenanceMode ?? false,
          updatedAt: notice.updatedAt ?? ts,
        },
      },
      {
        headers: { "Cache-Control": "no-store, max-age=0" },
      }
    )
  } catch (error) {
    console.error("[/api/signal] Failed to reach election backend:", error)
    return NextResponse.json(
      { error: "Unable to fetch broadcast data — backend unreachable" },
      { status: 502 }
    )
  }
}
