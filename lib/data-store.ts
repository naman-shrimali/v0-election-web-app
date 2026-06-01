/**
 * data-store.ts
 * Server-side only. Reads/writes the local JSON data files that act as
 * our lightweight database for election results and notices.
 */

import fs from "fs"
import path from "path"

// ─── Types ────────────────────────────────────────────────────────────────────

export type Candidate = {
  id: number
  rank: number | string
  serial: string
  name: string
  place: string
  barAssociation: string
  judgeship: string
  enrollmentDate: string
  votes: number
  share: number
  transfer: number
  status: string
  standing: string
  trend: number | string
}

export type CandidateStore = {
  candidates: Candidate[]
  updatedAt: string
  framesCollected: number
  totalFrames: number
}

export type Notice = {
  text: string
  maintenanceMode: boolean
  updatedAt: string
}

// ─── File Paths ───────────────────────────────────────────────────────────────

// process.cwd() points to the Next.js project root in dev and production
const DATA_DIR = path.join(process.cwd(), "data")
const RESULTS_PATH = path.join(DATA_DIR, "results.json")
const NOTICE_PATH = path.join(DATA_DIR, "notice.json")

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

// ─── Candidates ───────────────────────────────────────────────────────────────

const DEFAULT_STORE: CandidateStore = {
  candidates: [],
  updatedAt: new Date().toISOString(),
  framesCollected: 0,
  totalFrames: 12,
}

export function readCandidates(): CandidateStore {
  try {
    const raw = fs.readFileSync(RESULTS_PATH, "utf8")
    return JSON.parse(raw) as CandidateStore
  } catch {
    return DEFAULT_STORE
  }
}

export function writeCandidates(store: CandidateStore): void {
  ensureDataDir()
  // Write to a temp file then rename for atomic update
  const tmp = RESULTS_PATH + ".tmp"
  fs.writeFileSync(tmp, JSON.stringify(store, null, 2), "utf8")
  fs.renameSync(tmp, RESULTS_PATH)
}

// ─── Notice ───────────────────────────────────────────────────────────────────

const DEFAULT_NOTICE: Notice = {
  text: "Live counting results are being fetched and updated in real time.",
  maintenanceMode: false,
  updatedAt: new Date().toISOString(),
}

export function readNotice(): Notice {
  try {
    const raw = fs.readFileSync(NOTICE_PATH, "utf8")
    return JSON.parse(raw) as Notice
  } catch {
    return DEFAULT_NOTICE
  }
}

export function writeNotice(notice: Notice): void {
  ensureDataDir()
  fs.writeFileSync(NOTICE_PATH, JSON.stringify(notice, null, 2), "utf8")
}
