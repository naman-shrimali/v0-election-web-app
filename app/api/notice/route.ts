import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

const NOTICE_API_URL = "https://counting2026.com/api/notice"

export async function GET() {
  try {
    const response = await fetch(NOTICE_API_URL, {
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
        { error: `Notice API returned ${response.status}` },
        { status: response.status },
      )
    }

    const notice = await response.json()

    return NextResponse.json(notice, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    })
  } catch (error) {
    console.error("Failed to fetch counting notice", error)

    return NextResponse.json(
      { error: "Unable to fetch counting notice" },
      { status: 502 },
    )
  }
}
