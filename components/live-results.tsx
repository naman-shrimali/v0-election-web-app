"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
// decryptPayload removed — /api/pulse now returns plain JSON (no AES encryption)
// import { decryptPayload } from "@/lib/crypto"
import Image from "next/image"
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
  Pause,
  Play,
  RefreshCw,
  Search,
  Vote,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

type Candidate = {
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

type PulseResponse = {
  candidates: Candidate[]
  updatedAt: string
  framesCollected: number
  totalFrames: number
  nextRefreshInMs: number
}

type Notice = {
  text?: string
  maintenanceMode?: boolean
}

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]
const ALL_ROWS_VALUE = "all"
const AUTO_PAGE_INTERVAL_MS = 6000
const REFRESH_INTERVAL_MS = 30_000 // 30 seconds — matches the scraper cycle
const FEATURED_SERIAL = "5"         // Ballot No. 5 = Sh. Suresh Chandra Shrimali

function toNumber(value: number | string | undefined, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function formatNumber(value: number | string | undefined) {
  return toNumber(value).toLocaleString("en-IN")
}

function normalize(value: string | number | undefined) {
  return String(value ?? "").toLowerCase()
}

function TrendIndicator({ trend }: { trend: Candidate["trend"] }) {
  const trendValue = toNumber(trend)

  if (trendValue > 0) {
    return (
      <span className="inline-flex items-center gap-1 text-emerald-700">
        <ArrowUp className="h-3.5 w-3.5" />
        {trendValue}
      </span>
    )
  }

  if (trendValue < 0) {
    return (
      <span className="inline-flex items-center gap-1 text-rose-700">
        <ArrowDown className="h-3.5 w-3.5" />
        {Math.abs(trendValue)}
      </span>
    )
  }

  return <span className="text-muted-foreground">0</span>
}

function ProviderCard({
  className,
  isSpotlight = false,
}: {
  className?: string
  isSpotlight?: boolean
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border bg-card shadow-sm",
        isSpotlight &&
          "w-full max-w-xl border-amber-300 shadow-2xl ring-4 ring-amber-100",
        className,
      )}
    >
      <div
        className={cn(
          "grid items-center gap-4 p-4",
          isSpotlight
            ? "grid-cols-[88px_1fr] p-5 sm:grid-cols-[108px_1fr] sm:p-6"
            : "grid-cols-[70px_1fr] sm:grid-cols-[86px_1fr]",
        )}
      >
        <div
          className={cn(
            "relative overflow-hidden rounded-md bg-amber-50",
            isSpotlight ? "h-40 sm:h-48" : "h-28 sm:h-32",
          )}
        >
          <Image
            src="/assets/newProfile.png"
            alt="Sh. Suresh Chandra Shrimali"
            fill
            sizes={isSpotlight ? "108px" : "86px"}
            className="scale-125 object-contain object-bottom"
            priority
          />
        </div>
        <div>
          <p
            className={cn(
              "font-semibold uppercase tracking-[0.16em] text-amber-700",
              isSpotlight ? "text-sm" : "text-xs",
            )}
          >
            Results provided by
          </p>
          <p
            className={cn(
              "mt-2 font-hindi font-bold leading-tight text-foreground",
              isSpotlight ? "text-xl sm:text-2xl" : "text-base",
            )}
          >
            Advocate
          </p>
          <h2
            className={cn(
              "mt-2 font-hindi font-bold leading-tight text-foreground",
              isSpotlight ? "text-2xl sm:text-4xl" : "text-xl",
            )}
          >
            Sh. Suresh Chandra Shrimali
          </h2>
          <div
            className={cn(
              "mt-4 inline-flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 font-bold text-amber-900",
              isSpotlight ? "px-4 py-3 text-base" : "px-3 py-2 text-sm",
            )}
          >
            <Vote className={cn(isSpotlight ? "h-5 w-5" : "h-4 w-4")} />
            Ballot No. 05
          </div>
        </div>
      </div>
    </div>
  )
}

export function LiveResults() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [notice, setNotice] = useState<Notice | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [pageSize, setPageSize] = useState<number | "all">("all")
  const [page, setPage] = useState(1)
  const [autoPage, setAutoPage] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [showProviderIntro, setShowProviderIntro] = useState(true)
  const [framesCollected, setFramesCollected] = useState(0)
  const [totalFrames, setTotalFrames] = useState(12)
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL_MS / 1000)
  const nextRefreshMsRef = useRef<number>(REFRESH_INTERVAL_MS)

  const fetchLiveData = useCallback(async () => {
    setIsRefreshing(true)
    setError(null)

    // ── Old AES-256-CBC decryption removed ──────────────────────────────────
    // Previously: fetched encrypted payload from election_backend and decrypted
    // with decryptPayload(). Now /api/pulse returns plain JSON directly.
    // ────────────────────────────────────────────────────────────────────────

    const [candidateResult, noticeResult] = await Promise.allSettled([
      fetch("/api/pulse", { cache: "no-store" }),
      fetch("/api/signal", { cache: "no-store" }),
    ])

    try {
      if (candidateResult.status !== "fulfilled" || !candidateResult.value.ok) {
        throw new Error("Live candidate count is not available right now.")
      }

      // /api/pulse returns { candidates, updatedAt, framesCollected, totalFrames, nextRefreshInMs }
      const pulseData: PulseResponse = await candidateResult.value.json()

      if (!Array.isArray(pulseData.candidates)) {
        throw new Error("Live candidate count returned an unexpected format.")
      }

      setCandidates(pulseData.candidates)
      setLastUpdated(new Date())
      setFramesCollected(pulseData.framesCollected ?? 0)
      setTotalFrames(pulseData.totalFrames ?? 12)

      // Sync countdown to the server's reported next-refresh time
      const nextMs = pulseData.nextRefreshInMs ?? REFRESH_INTERVAL_MS
      nextRefreshMsRef.current = nextMs
      setCountdown(Math.round(nextMs / 1000))

      if (noticeResult.status === "fulfilled" && noticeResult.value.ok) {
        try {
          const { notice: noticeData } = await noticeResult.value.json()
          setNotice(noticeData ?? null)
        } catch {
          setNotice(null)
        }
      }
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Unable to load live counting data.",
      )
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchLiveData()
    const refreshTimer = window.setInterval(fetchLiveData, REFRESH_INTERVAL_MS)

    return () => window.clearInterval(refreshTimer)
  }, [fetchLiveData])

  // Countdown timer — ticks every second, reset when fetchLiveData fires
  useEffect(() => {
    const tick = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) return Math.round(nextRefreshMsRef.current / 1000)
        return prev - 1
      })
    }, 1000)
    return () => window.clearInterval(tick)
  }, [])

  useEffect(() => {
    const introTimer = window.setTimeout(() => setShowProviderIntro(false), 2000)

    return () => window.clearTimeout(introTimer)
  }, [])

  const sortedCandidates = useMemo(() => {
    return [...candidates].sort((first, second) => {
      const voteDifference = toNumber(second.votes) - toNumber(first.votes)

      if (voteDifference !== 0) {
        return voteDifference
      }

      const firstRank = toNumber(first.rank, Number.MAX_SAFE_INTEGER)
      const secondRank = toNumber(second.rank, Number.MAX_SAFE_INTEGER)

      return firstRank - secondRank
    })
  }, [candidates])

  const filteredCandidates = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    if (!query) {
      return sortedCandidates
    }

    return sortedCandidates.filter((candidate) => {
      const haystack = [
        candidate.serial,
        candidate.name,
        candidate.place,
        candidate.barAssociation,
        candidate.judgeship,
      ]
        .map(normalize)
        .join(" ")

      return haystack.includes(query)
    })
  }, [searchTerm, sortedCandidates])

  const effectivePageSize =
    pageSize === "all" ? Math.max(1, filteredCandidates.length) : pageSize
  const totalPages = Math.max(1, Math.ceil(filteredCandidates.length / effectivePageSize))
  const firstRow = (page - 1) * effectivePageSize
  const pageCandidates = filteredCandidates.slice(
    firstRow,
    firstRow + effectivePageSize,
  )

  const totalVotes = useMemo(
    () => candidates.reduce((sum, candidate) => sum + toNumber(candidate.votes), 0),
    [candidates],
  )

  useEffect(() => {
    setPage(1)
  }, [pageSize, searchTerm])

  useEffect(() => {
    setPage((currentPage) => Math.min(currentPage, totalPages))
  }, [totalPages])

  useEffect(() => {
    if (!autoPage || totalPages <= 1) {
      return
    }

    const pageTimer = window.setInterval(() => {
      setPage((currentPage) => (currentPage >= totalPages ? 1 : currentPage + 1))
    }, AUTO_PAGE_INTERVAL_MS)

    return () => window.clearInterval(pageTimer)
  }, [autoPage, totalPages])

  const visibleStart = filteredCandidates.length === 0 ? 0 : firstRow + 1
  const visibleEnd = Math.min(firstRow + effectivePageSize, filteredCandidates.length)

  if (showProviderIntro) {
    return (
      <section
        id="live-count"
        className="flex min-h-screen items-center justify-center bg-amber-50 px-4 pt-16"
      >
        <ProviderCard isSpotlight />
      </section>
    )
  }

  return (
    <section id="live-count" className="min-h-screen bg-background">
      <div className="container mx-auto px-3 py-4 pt-20 sm:px-4 md:py-6 md:pt-24">
        <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
          <div
            id="counting-notice"
            className={cn(
              "border-b p-3",
              notice?.maintenanceMode
                ? "border-rose-200 bg-rose-50 text-rose-900"
                : "border-sky-200 bg-sky-50 text-sky-950",
            )}
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-1.5">
                <AlertCircle className="mt-0.5 h-3 w-3 shrink-0 opacity-70" />
                <p className="text-[10px] leading-tight">
                  <span className="font-semibold">Notice: </span>
                  {notice?.text?.trim() || "No current notice has been issued."}
                </p>
              </div>
              {lastUpdated ? (
                <div className="flex items-center gap-2 whitespace-nowrap text-xs font-medium opacity-80">
                  <Clock className="h-3.5 w-3.5" />
                  {lastUpdated.toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </div>
              ) : null}
            </div>
          </div>
          <div className="flex flex-col gap-4 border-b p-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <Badge
                variant="outline"
                className="border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Live counting
              </Badge>
              {/* Scraper status badge */}
              {framesCollected < totalFrames ? (
                <Badge
                  variant="outline"
                  className="border-amber-200 bg-amber-50 px-3 py-1 text-amber-700"
                  title={`Collecting data — ${framesCollected} of ${totalFrames} frames scraped`}
                >
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Updating
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="border-sky-200 bg-sky-50 px-3 py-1 text-sky-700"
                >
                  Live
                </Badge>
              )}
              {candidates.length >= 234 && (
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {formatNumber(totalVotes)}
                  </span>
                  <span>votes</span>
                  <span className="text-border">|</span>
                  <span className="font-medium text-foreground">
                    {formatNumber(candidates.length)}
                  </span>
                  <span>candidates</span>
                </div>
              )}
            </div>
            <div className="relative max-w-xl flex-1 xl:max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="pl-9"
                placeholder="Search by serial, name, place, bar association, or judgeship"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Rows</span>
                <Select
                  value={String(pageSize)}
                  onValueChange={(value) =>
                    setPageSize(value === ALL_ROWS_VALUE ? "all" : Number(value))
                  }
                >
                  <SelectTrigger className="w-[86px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAGE_SIZE_OPTIONS.map((option) => (
                      <SelectItem key={option} value={String(option)}>
                        {option}
                      </SelectItem>
                    ))}
                    <SelectItem value={ALL_ROWS_VALUE}>All</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Switch checked={autoPage} onCheckedChange={setAutoPage} />
                Auto page
              </label>

              {/* Countdown to next auto-refresh */}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground tabular-nums">
                <Clock className="h-3.5 w-3.5" />
                <span>Refresh in</span>
                <span className="min-w-[2ch] font-semibold text-foreground">{countdown}s</span>
              </div>

              <Button
                variant="outline"
                onClick={fetchLiveData}
                disabled={isRefreshing}
              >
                {isRefreshing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Refresh
              </Button>
            </div>
          </div>

          {error ? (
            <div className="border-b border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          <Table>
            <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="w-10 px-1.5 text-[11px] sm:w-14 sm:px-2 sm:text-sm">
                  S. No.
                </TableHead>
                <TableHead className="w-14 px-1.5 text-[11px] sm:w-[88px] sm:px-2 sm:text-sm">
                  Ballot No.
                </TableHead>
                <TableHead className="min-w-[132px] px-1.5 text-[11px] sm:min-w-[260px] sm:px-2 sm:text-sm">
                  Candidate
                </TableHead>
                <TableHead className="w-[72px] px-1.5 text-right text-[11px] sm:w-auto sm:px-2 sm:text-sm">
                  Votes
                </TableHead>
                <TableHead className="hidden sm:table-cell">Place</TableHead>
                <TableHead className="hidden md:table-cell">Bar Association</TableHead>
                <TableHead className="hidden lg:table-cell">Judgeship</TableHead>
                <TableHead className="hidden text-right md:table-cell">
                  Transfer
                </TableHead>
                <TableHead className="hidden text-right lg:table-cell">Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 8 }).map((_, index) => (
                  <TableRow key={index}>
                     {[
                      "",
                      "",
                      "",
                      "",
                      "hidden sm:table-cell",
                      "hidden md:table-cell",
                      "hidden lg:table-cell",
                      "hidden md:table-cell",
                      "hidden lg:table-cell",
                    ].map((cellClassName, cellIndex) => (
                      <TableCell key={cellIndex} className={cellClassName}>
                        <div className="h-4 animate-pulse rounded bg-muted" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : pageCandidates.length > 0 ? (
                pageCandidates.map((candidate, index) => {
                  const isFeatured =
                    candidate.serial === FEATURED_SERIAL
                  const serialNumber = firstRow + index + 1

                  return (
                    <TableRow
                      key={`${candidate.id}-${candidate.serial}`}
                      className={cn(
                        isFeatured &&
                        "border-l-4 border-l-amber-500 bg-amber-50/80 hover:bg-amber-50",
                      )}
                    >
                      <TableCell className="px-1.5 text-xs font-semibold sm:px-2 sm:text-sm">
                        {serialNumber}
                      </TableCell>
                      <TableCell className="px-1.5 sm:px-2">
                        <Badge
                          variant={isFeatured ? "default" : "outline"}
                          className={cn(
                            "px-1.5 text-[11px] sm:px-2 sm:text-xs",
                            isFeatured && "bg-amber-600 text-white hover:bg-amber-600",
                          )}
                        >
                          {String(candidate.serial).padStart(2, "0")}
                        </Badge>
                      </TableCell>
                      <TableCell
                        className="max-w-[132px] px-1.5 text-xs font-semibold sm:max-w-none sm:px-2 sm:text-sm"
                        title={candidate.name}
                      >
                        <span className="block truncate sm:whitespace-normal">
                          {candidate.name}
                        </span>
                        <span className="mt-0.5 block truncate text-[10px] font-medium uppercase tracking-wide text-muted-foreground sm:hidden">
                          {candidate.place || "-"}
                        </span>
                        {candidate.standing ? (
                          <span className="ml-2 text-xs font-medium text-muted-foreground">
                            {candidate.standing}
                          </span>
                        ) : null}
                      </TableCell>
                      <TableCell className="px-1.5 text-right text-xs font-bold sm:px-2 sm:text-sm">
                        {formatNumber(candidate.votes)}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {candidate.place || "-"}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {candidate.barAssociation || "-"}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {candidate.judgeship || "-"}
                      </TableCell>
                      <TableCell className="hidden text-right md:table-cell">
                        {formatNumber(candidate.transfer)}
                      </TableCell>
                      <TableCell className="hidden text-right lg:table-cell">
                        <TrendIndicator trend={candidate.trend} />
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="h-28 text-center text-muted-foreground"
                  >
                    No candidates match the current search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="flex flex-col gap-3 border-t p-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {visibleStart}-{visibleEnd} of{" "}
              {formatNumber(filteredCandidates.length)} candidates
            </p>
            <div className="flex items-center justify-between gap-3 md:justify-end">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setAutoPage((value) => !value)}
                aria-label={autoPage ? "Pause auto pagination" : "Start auto pagination"}
              >
                {autoPage ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
                disabled={page <= 1}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="min-w-24 text-center text-sm font-medium">
                Page {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setPage((currentPage) => Math.min(totalPages, currentPage + 1))
                }
                disabled={page >= totalPages}
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
