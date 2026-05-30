import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

/** @deprecated — this route has moved to /api/signal */
export async function GET() {
  return NextResponse.redirect(new URL("/api/signal", "http://localhost:3000"), {
    status: 301,
  })
}

