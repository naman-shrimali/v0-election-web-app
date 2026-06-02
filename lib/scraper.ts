/**
 * scraper.ts
 * Server-side only. Manages a persistent Puppeteer browser + page that
 * visits counting2026.com and progressively collects election results
 * one frame at a time, writing to data/results.json after each new frame.
 *
 * Architecture:
 *  - A singleton browser+page is kept alive across scrape cycles.
 *  - Every SCRAPE_INTERVAL_MS (30 s), we check the current visible frame.
 *  - If it's a new frame we haven't seen, we extract + merge its candidates.
 *  - After all 12 frames are collected we keep polling to detect vote changes.
 */

import type { Browser, Page } from "puppeteer"
import { readCandidates, writeCandidates } from "./data-store"
import type { Candidate, CandidateStore } from "./data-store"
import os from "os"
import path from "path"

// ─── Constants ────────────────────────────────────────────────────────────────

const TARGET_URL = "https://counting2026.com"
const TOTAL_FRAMES = 12
export const SCRAPE_INTERVAL_MS = 30_000

// ─── Singleton State ──────────────────────────────────────────────────────────

let browser: Browser | null = null
let page: Page | null = null
let scraperTimer: ReturnType<typeof setTimeout> | null = null
let visitedFrames: Set<string> = new Set()
let lastScrapeAt: Date | null = null
let nextScrapeAt: Date | null = null
let isRunning = false
let isScraping = false

// ─── Raw Row Type (from page.evaluate) ───────────────────────────────────────

type RawRow = {
  frameNumber: string | null
  rows: string[]
}

// ─── Browser Management ───────────────────────────────────────────────────────

async function ensureBrowser(): Promise<{ browser: Browser; page: Page }> {
  if (browser && page) {
    try {
      // Quick health check — throws if browser has crashed
      await page.title()
      return { browser, page }
    } catch {
      // console.log("[scraper] Browser unresponsive, restarting...")
      browser = null
      page = null
    }
  }

  // console.log("[scraper] Launching Puppeteer...")
  const puppeteer = (await import("puppeteer")).default

  let executablePath: string | undefined
  try {
    executablePath = await puppeteer.executablePath()
  } catch {
    const version = "149.0.7827.22"
    const platform = process.platform === "darwin"
      ? process.arch === "arm64" ? "mac_arm" : "mac"
      : process.platform === "win32" ? "win64" : "linux"

    const binaryMap: Record<string, string> = {
      mac_arm: `chrome/mac_arm-${version}/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`,
      mac: `chrome/mac-${version}/chrome-mac-x64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`,
      linux: `chrome/linux-${version}/chrome-linux64/chrome`,
      win64: `chrome/win64-${version}/chrome-win64/chrome.exe`,
    }

    executablePath = path.join(
      os.homedir(), ".cache", "puppeteer",
      binaryMap[platform] ?? binaryMap["mac_arm"]
    )
  }

  // console.log(`[scraper] Using Chrome at: ${executablePath}`)

  browser = await puppeteer.launch({
    headless: true,
    executablePath,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      // Force the browser to never use its on-disk HTTP cache
      "--disable-application-cache",
      "--disable-cache",
    ],
  })

  page = await browser.newPage()

  // ── Disable ALL caching so every reload fetches fresh data from the server ──
  await page.setCacheEnabled(false)

  // Intercept requests to strip any cache-friendly headers the site might set
  await page.setExtraHTTPHeaders({
    "Cache-Control": "no-cache, no-store, must-revalidate",
    "Pragma": "no-cache",
  })

  await page.setViewport({ width: 1280, height: 900 })
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) " +
      "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  )

  // console.log(`[scraper] Navigating to ${TARGET_URL}...`)
  await page.goto(TARGET_URL, { waitUntil: "networkidle2", timeout: 60_000 })
  // console.log("[scraper] Initial page load complete")

  return { browser, page: page! }
}

// ─── Frame Extraction ─────────────────────────────────────────────────────────

// How long to wait after a reload for the site's own React/JS to fetch
// and render fresh data before we extract. The site makes its own API
// calls to get vote counts — we must let those complete.
const POST_RELOAD_SETTLE_MS = 8_000

async function extractCurrentFrame(pg: Page): Promise<RawRow> {
  // ── Force a full page reload so the site's own API fetches fresh data ────────
  // Without this, the browser serves its in-memory DOM (which may be minutes
  // old) and we get stale vote counts even with cache disabled.
  // console.log("[scraper] Reloading page for fresh data...")
  await pg.reload({ waitUntil: "networkidle2", timeout: 60_000 })

  // Give the site's own JS (React + data-fetch) time to settle after reload
  // console.log(`[scraper] Waiting ${POST_RELOAD_SETTLE_MS / 1000}s for data to render...`)
  await new Promise((r) => setTimeout(r, POST_RELOAD_SETTLE_MS))

  return pg.evaluate(() => {
    const bodyText = document.body?.innerText ?? ""

    // The site shows "Frame X/12" in its UI
    const frameMatch = bodyText.match(/Frame\s+(\d+)\/(\d+)/i)
    const frameNumber = frameMatch ? frameMatch[1] : null

    // Rows are <article class*="grid-cols"> elements with 4 children:
    //   [0] Sr. No.  | [1] Ballot No. | [2] Name\nPlace | [3] Votes
    // We also fall back to div[class*="grid-cols"] for older site versions.
    const rows = Array.from(
      document.querySelectorAll(
        'article[class*="grid-cols"], div[class*="grid-cols"]'
      )
    )
      .map((r) => (r as HTMLElement).innerText)
      // Valid rows start with two numbers (Sr.No \n BallotNo)
      .filter((t) => /^\d+\n\d+/.test(t))

    return { frameNumber, rows }
  })
}

// ─── Row Parsing ──────────────────────────────────────────────────────────────

function parseRows(rawRows: string[]): Partial<Candidate>[] {
  return rawRows.map((text) => {
    const parts = text
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean)

    // After filter(Boolean) the article's innerText gives exactly:
    //   parts[0] = Sr. No.    (rank shown on source site, discarded)
    //   parts[1] = Ballot No. (candidate ballot number → our "serial")
    //   parts[2] = Name
    //   parts[3] = Votes      ← NOTE: votes comes before place in the DOM
    //   parts[4] = Place
    // (The two empty strings from CSS-only elements are stripped by filter)
    return {
      serial: parts[1] || "",         // Ballot No.
      name: parts[2] || "",           // Candidate name
      votes: Number(parts[3]) || 0,   // Vote count  ← index 3
      place: parts[4] || "",          // Place / district  ← index 4
      barAssociation: "",
      judgeship: "",
      enrollmentDate: "",
      share: 0,
      transfer: 0,
      status: "",
      standing: "",
      trend: 0,
    }
  })
}

// ─── Merge + Rank ─────────────────────────────────────────────────────────────

function mergeAndRank(
  existing: Candidate[],
  incoming: Partial<Candidate>[]
): Candidate[] {
  // Build a map keyed by ballot serial for fast lookup
  const map = new Map<string, Candidate>(
    existing.map((c) => [c.serial, c])
  )

  let nextId = existing.length + 1

  for (const raw of incoming) {
    const serial = raw.serial!
    if (!serial) continue

    if (map.has(serial)) {
      // Update votes (and other scraped fields) for existing candidate
      const existing = map.get(serial)!
      const oldVotes = existing.votes
      const newVotes = raw.votes ?? existing.votes
      map.set(serial, {
        ...existing,
        votes: newVotes,
        trend: newVotes - oldVotes, // positive = gaining votes
        place: raw.place || existing.place,
        name: raw.name || existing.name,
      })
    } else {
      // New candidate from this frame
      map.set(serial, {
        id: nextId++,
        rank: 0, // will be recalculated below
        serial,
        name: raw.name || "",
        place: raw.place || "",
        barAssociation: "",
        judgeship: "",
        enrollmentDate: "",
        votes: raw.votes ?? 0,
        share: 0,
        transfer: 0,
        status: "",
        standing: "",
        trend: 0,
      })
    }
  }

  const merged = Array.from(map.values())

  // Sort by votes desc, then by serial asc as tiebreaker
  merged.sort((a, b) => {
    const diff = b.votes - a.votes
    return diff !== 0 ? diff : Number(a.serial) - Number(b.serial)
  })

  // Assign rank
  merged.forEach((c, i) => {
    c.rank = i + 1
  })

  return merged
}

// ─── Single Scrape Cycle ──────────────────────────────────────────────────────

export async function runScrapeCycle(): Promise<{
  newFrame: boolean
  frameNumber: string | null
  framesCollected: number
}> {
  if (isScraping) {
    return { newFrame: false, frameNumber: null, framesCollected: visitedFrames.size }
  }

  isScraping = true
  lastScrapeAt = new Date()

  try {
    const { page: pg } = await ensureBrowser()
    const result = await extractCurrentFrame(pg)

    if (!result.frameNumber) {
      // Could not detect frame number — skip this cycle
      return { newFrame: false, frameNumber: null, framesCollected: visitedFrames.size }
    }

    const isNewFrame = !visitedFrames.has(result.frameNumber)
    if (isNewFrame) visitedFrames.add(result.frameNumber)

    // ── Always merge & write, whether the frame is new or revisited ────────────
    // Critical fix: previously we returned early for "seen" frames without ever
    // calling writeCandidates() again — so the JSON froze after the first full
    // 12-frame rotation. Now we write on every cycle with the latest vote counts.
    if (result.rows.length > 0) {
      const parsed = parseRows(result.rows)
      const existing = readCandidates()
      const merged = mergeAndRank(existing.candidates, parsed)

      writeCandidates({
        candidates: merged,
        updatedAt: new Date().toISOString(),
        framesCollected: visitedFrames.size,
        totalFrames: TOTAL_FRAMES,
      })
    }

    // ── Reset after a full rotation so framesCollected restarts ──────────────
    // Once all 12 frames are seen, clear the tracker so the next rotation
    // is treated as a fresh pass with updated vote counts.
    if (visitedFrames.size >= TOTAL_FRAMES) {
      visitedFrames.clear()
    }

    return {
      newFrame: isNewFrame,
      frameNumber: result.frameNumber,
      framesCollected: visitedFrames.size,
    }
  } catch (err) {
    console.error("[scraper] Cycle error:", err)
    browser = null
    page = null
    return { newFrame: false, frameNumber: null, framesCollected: visitedFrames.size }
  } finally {
    isScraping = false
  }
}

// ─── Background Loop ──────────────────────────────────────────────────────────

function scheduleNextCycle() {
  nextScrapeAt = new Date(Date.now() + SCRAPE_INTERVAL_MS)
  scraperTimer = setTimeout(async () => {
    await runScrapeCycle()
    scheduleNextCycle()
  }, SCRAPE_INTERVAL_MS)
}

export function startScraperLoop(): void {
  if (isRunning) {
    // console.log("[scraper] Loop already running")
    return
  }
  isRunning = true
  // console.log(
  //   `[scraper] Starting background loop (interval: ${SCRAPE_INTERVAL_MS / 1000}s)`
  // )

  // Run first cycle immediately (but don't block — fire-and-forget)
  runScrapeCycle().then(() => {
    scheduleNextCycle()
  })
}

export function stopScraperLoop(): void {
  isRunning = false
  if (scraperTimer) {
    clearTimeout(scraperTimer)
    scraperTimer = null
  }
  if (browser) {
    browser.close().catch(() => {})
    browser = null
    page = null
  }
  // console.log("[scraper] Loop stopped")
}

// ─── Status ───────────────────────────────────────────────────────────────────

export function getScraperStatus() {
  const now = Date.now()
  const nextIn = nextScrapeAt ? Math.max(0, nextScrapeAt.getTime() - now) : null

  return {
    isRunning,
    isScraping,
    framesCollected: visitedFrames.size,
    totalFrames: TOTAL_FRAMES,
    lastScrapeAt: lastScrapeAt?.toISOString() ?? null,
    nextScrapeAt: nextScrapeAt?.toISOString() ?? null,
    nextScrapeInMs: nextIn,
  }
}
