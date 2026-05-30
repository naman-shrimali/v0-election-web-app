import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

/**
 * Proxy route: forwards requests to the local election_backend /api/pulse.
 * The backend returns an AES-256-CBC encrypted payload — we pass it through
 * unchanged so the browser receives the encrypted blob for client-side decryption.
 */
const BACKEND_URL =
  process.env.ELECTION_BACKEND_URL ?? "http://localhost:5001"

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/pulse`, {
      cache: "no-store",
    })

    if (!response.ok) {
      const body = await response.text()
      return NextResponse.json(
        { error: `Backend returned ${response.status}`, detail: body },
        { status: response.status },
      )
    }

    // Forward the encrypted JSON blob as-is to the client
    const encryptedData = await response.json()

    return NextResponse.json(encryptedData, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    })
  } catch (error) {
    console.error("Failed to reach election backend for pulse", error)

    return NextResponse.json(
      { error: "Unable to fetch live results" },
      { status: 502 },
    )
  }
}
