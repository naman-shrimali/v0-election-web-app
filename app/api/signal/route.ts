import { NextResponse } from "next/server"
import { readNotice } from "@/lib/data-store"

export const dynamic = "force-dynamic"

// ─── Previously: proxy to election_backend /api/signal (AES-256-CBC encrypted) ─
//
// const BACKEND_URL = process.env.ELECTION_BACKEND_URL ?? "http://localhost:5001"
//
// export async function GET() {
//   try {
//     const response = await fetch(`${BACKEND_URL}/api/signal`, { cache: "no-store" })
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
//     console.error("Failed to reach election backend for signal", error)
//     return NextResponse.json({ error: "Unable to fetch broadcast data" }, { status: 502 })
//   }
// }
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/signal
 *
 * Returns the current notice/announcement read from data/notice.json.
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
  try {
    const notice = readNotice()
    return NextResponse.json(
      { notice },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    )
  } catch (error) {
    console.error("[/api/signal] Failed to read notice:", error)
    return NextResponse.json(
      { error: "Unable to fetch broadcast data" },
      { status: 500 }
    )
  }
}
