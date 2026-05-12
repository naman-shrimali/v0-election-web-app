import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

const CANDIDATES_API_URL = "https://counting2026.com/api/candidates"

export async function GET() {
  try {
    const response = await fetch(CANDIDATES_API_URL, {
      cache: "no-store",
      headers: {
        accept: "*/*",
        referer: "https://counting2026.com/",
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36",
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Counting API returned ${response.status}` },
        { status: response.status },
      )
    }

    const candidates = await response.json()

    return NextResponse.json(candidates, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    })
  } catch (error) {
    console.error("Failed to fetch live candidate counts", error)

    return NextResponse.json(
      { error: "Unable to fetch live candidate counts" },
      { status: 502 },
    )
  }
}
