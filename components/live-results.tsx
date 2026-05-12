"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
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
  UserRound,
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

type Notice = {
  text?: string
  maintenanceMode?: boolean
}

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]
const AUTO_PAGE_INTERVAL_MS = 6000
const REFRESH_INTERVAL_MS = 15000
const FEATURED_SERIAL = "5"

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

export function LiveResults() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [notice, setNotice] = useState<Notice | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [pageSize, setPageSize] = useState(20)
  const [page, setPage] = useState(1)
  const [autoPage, setAutoPage] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchLiveData = useCallback(async () => {
    setIsRefreshing(true)
    setError(null)

    const [candidateResult, noticeResult] = await Promise.allSettled([
      fetch("/api/candidates", { cache: "no-store" }),
      fetch("/api/notice", { cache: "no-store" }),
    ])

    try {
      if (candidateResult.status !== "fulfilled" || !candidateResult.value.ok) {
        throw new Error("Live candidate count is not available right now.")
      }

      const candidateData = await candidateResult.value.json()

      if (!Array.isArray(candidateData)) {
        throw new Error("Live candidate count returned an unexpected format.")
      }

      setCandidates(candidateData)
      setLastUpdated(new Date())

      if (noticeResult.status === "fulfilled" && noticeResult.value.ok) {
        try {
          setNotice(await noticeResult.value.json())
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

  const sortedCandidates = useMemo(() => {
    return [...candidates].sort((first, second) => {
      const firstRank = toNumber(first.rank, Number.MAX_SAFE_INTEGER)
      const secondRank = toNumber(second.rank, Number.MAX_SAFE_INTEGER)

      if (firstRank !== secondRank) {
        return firstRank - secondRank
      }

      return toNumber(second.votes) - toNumber(first.votes)
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

  const totalPages = Math.max(1, Math.ceil(filteredCandidates.length / pageSize))
  const firstRow = (page - 1) * pageSize
  const pageCandidates = filteredCandidates.slice(firstRow, firstRow + pageSize)

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
  const visibleEnd = Math.min(firstRow + pageSize, filteredCandidates.length)

  return (
    <section id="live-count" className="min-h-screen bg-background">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 pb-8 pt-24 md:pb-10 md:pt-28">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-end">
            <div className="max-w-4xl">
              <Badge
                variant="outline"
                className="mb-5 border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Live counting
              </Badge>
              <h1 className="font-hindi text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Bar Council of Rajasthan Election 2026 Live Vote Count
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                Candidate-wise live vote count, rank, vote share, transfer status,
                and counting notices in one simple dashboard.
              </p>
            </div>

            <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
              <div className="grid grid-cols-[124px_1fr] items-center gap-4 p-4">
                <div className="relative h-32 overflow-hidden rounded-md bg-slate-100">
                  <Image
                    src="/assets/newProfile.png"
                    alt="Sh. Suresh Chandra Shrimali"
                    fill
                    sizes="124px"
                    className="object-contain object-bottom"
                    priority
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Results provided by
                  </p>
                  <h5 className="mt-2 font-hindi font-bold leading-tight">
                    Advocate
                  </h5>
                  <h2 className="mt-2 font-hindi text-xl font-bold leading-tight">
                    Sh. Suresh Chandra Shrimali
                  </h2>
                  <div className="mt-4 inline-flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900">
                    <Vote className="h-4 w-4" />
                    Ballot No. 05
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="mb-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-muted-foreground">Total votes</p>
              <Vote className="h-4 w-4 text-emerald-700" />
            </div>
            <p className="mt-3 text-3xl font-bold">{formatNumber(totalVotes)}</p>
          </div>

          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-muted-foreground">Candidates</p>
              <UserRound className="h-4 w-4 text-sky-700" />
            </div>
            <p className="mt-3 text-3xl font-bold">{formatNumber(candidates.length)}</p>
          </div>
        </div>

        <div
          id="counting-notice"
          className={cn(
            "mb-4 rounded-lg border p-4",
            notice?.maintenanceMode
              ? "border-rose-200 bg-rose-50 text-rose-900"
              : "border-sky-200 bg-sky-50 text-sky-950",
          )}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="text-sm font-semibold">Bar Council of Rajasthan notice</p>
                <p className="mt-1 text-sm leading-6">
                  {notice?.text?.trim() || "No current notice has been issued."}
                </p>
              </div>
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

        <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
          <div className="flex flex-col gap-4 border-b p-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative max-w-xl flex-1">
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
                  onValueChange={(value) => setPageSize(Number(value))}
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
                  </SelectContent>
                </Select>
              </div>

              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Switch checked={autoPage} onCheckedChange={setAutoPage} />
                Auto page
              </label>

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
                <TableHead className="w-11 px-1.5 text-[11px] sm:w-[76px] sm:px-2 sm:text-sm">
                  Rank
                </TableHead>
                <TableHead className="w-14 px-1.5 text-[11px] sm:w-[88px] sm:px-2 sm:text-sm">
                  Ballot
                </TableHead>
                <TableHead className="min-w-[132px] px-1.5 text-[11px] sm:min-w-[260px] sm:px-2 sm:text-sm">
                  Candidate
                </TableHead>
                <TableHead className="w-[72px] px-1.5 text-right text-[11px] sm:w-auto sm:px-2 sm:text-sm">
                  Votes
                </TableHead>
                <TableHead>Place</TableHead>
                <TableHead>Bar Association</TableHead>
                <TableHead>Judgeship</TableHead>
                <TableHead className="text-right">Transfer</TableHead>
                <TableHead className="text-right">Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 8 }).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from({ length: 9 }).map((__, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <div className="h-4 animate-pulse rounded bg-muted" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : pageCandidates.length > 0 ? (
                pageCandidates.map((candidate) => {
                  const isFeatured =
                    candidate.serial === FEATURED_SERIAL || candidate.id === 5

                  return (
                    <TableRow
                      key={`${candidate.id}-${candidate.serial}`}
                      className={cn(
                        isFeatured &&
                        "border-l-4 border-l-amber-500 bg-amber-50/80 hover:bg-amber-50",
                      )}
                    >
                      <TableCell className="px-1.5 text-xs font-semibold sm:px-2 sm:text-sm">
                        {candidate.rank}
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
                        {candidate.standing ? (
                          <span className="ml-2 text-xs font-medium text-muted-foreground">
                            {candidate.standing}
                          </span>
                        ) : null}
                      </TableCell>
                      <TableCell className="px-1.5 text-right text-xs font-bold sm:px-2 sm:text-sm">
                        {formatNumber(candidate.votes)}
                      </TableCell>
                      <TableCell>{candidate.place || "-"}</TableCell>
                      <TableCell>{candidate.barAssociation || "-"}</TableCell>
                      <TableCell>{candidate.judgeship || "-"}</TableCell>
                      <TableCell className="text-right">
                        {formatNumber(candidate.transfer)}
                      </TableCell>
                      <TableCell className="text-right">
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
