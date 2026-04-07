"use client"

import { useState, useMemo, useCallback } from "react"
import Fuse from "fuse.js"
import { Search, User, Hash, Building2, Scale, Calendar, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import voterData from "@/data/voterData.json"

type Voter = {
  electoralNum: string
  rollNum: string
  dateOfEnrolment: string
  name: string
  barAssociation: string
  judgship: string
  smallName: string
  smallRollNum: string
}

// Initialize Fuse.js for fuzzy search
const fuseOptions = {
  keys: ["name", "rollNum", "smallName", "smallRollNum"],
  threshold: 0.3,
  ignoreLocation: true,
  includeScore: true,
}

const fuse = new Fuse(voterData as Voter[], fuseOptions)

export function VoterSearch() {
  const [nameQuery, setNameQuery] = useState("")
  const [rollNumQuery, setRollNumQuery] = useState("")
  const [results, setResults] = useState<Voter[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  // Debounced search function
  const performSearch = useCallback(() => {
    setIsSearching(true)
    setHasSearched(true)

    // Simulate slight delay for better UX
    setTimeout(() => {
      const trimmedName = nameQuery.trim().toLowerCase()
      const trimmedRollNum = rollNumQuery.trim().toLowerCase()

      if (!trimmedName && !trimmedRollNum) {
        setResults([])
        setIsSearching(false)
        return
      }

      let searchResults: Voter[] = []

      // If roll number is provided, prioritize exact/partial match
      if (trimmedRollNum) {
        const rollNumResults = (voterData as Voter[]).filter(
          (voter) =>
            voter.rollNum.toLowerCase().includes(trimmedRollNum) ||
            voter.smallRollNum.includes(trimmedRollNum)
        )

        if (trimmedName) {
          // Filter by both roll number and fuzzy name match
          const nameResults = fuse.search(trimmedName)
          const nameMatchIds = new Set(nameResults.map((r) => r.item.electoralNum))
          searchResults = rollNumResults.filter((v) => nameMatchIds.has(v.electoralNum))
        } else {
          searchResults = rollNumResults
        }
      } else if (trimmedName) {
        // Fuzzy search by name only
        const nameResults = fuse.search(trimmedName)
        searchResults = nameResults.map((r) => r.item)
      }

      setResults(searchResults)
      setIsSearching(false)
    }, 300)
  }, [nameQuery, rollNumQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch()
  }

  const clearSearch = () => {
    setNameQuery("")
    setRollNumQuery("")
    setResults([])
    setHasSearched(false)
  }

  return (
    <section id="voter-search" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-hindi font-bold text-3xl md:text-4xl text-foreground mb-4">
            मतदाता सूची खोजें
          </h2>
          <p className="font-hindi text-lg text-muted-foreground max-w-2xl mx-auto">
            अपना नाम या रोल नंबर दर्ज कर अपनी जानकारी प्राप्त करें
          </p>
        </div>

        {/* Search Form */}
        <Card className="max-w-2xl mx-auto border-none shadow-xl bg-card mb-8">
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="नाम दर्ज करें"
                    value={nameQuery}
                    onChange={(e) => setNameQuery(e.target.value)}
                    className="font-hindi pl-10 h-12 text-base"
                  />
                </div>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="रोल नंबर दर्ज करें (जैसे: R/173/1972)"
                    value={rollNumQuery}
                    onChange={(e) => setRollNumQuery(e.target.value)}
                    className="font-hindi pl-10 h-12 text-base"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  type="submit"
                  className="flex-1 font-hindi h-12 text-base bg-gradient-primary hover:opacity-90"
                  disabled={isSearching || (!nameQuery.trim() && !rollNumQuery.trim())}
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      खोज रहे हैं...
                    </>
                  ) : (
                    <>
                      <Search className="h-5 w-5 mr-2" />
                      खोजें
                    </>
                  )}
                </Button>
                {hasSearched && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={clearSearch}
                    className="font-hindi h-12 text-base"
                  >
                    साफ़ करें
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="max-w-4xl mx-auto">
          {isSearching && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <p className="font-hindi text-muted-foreground">खोज रहे हैं...</p>
            </div>
          )}

          {!isSearching && hasSearched && results.length === 0 && (
            <Card className="border-none shadow-lg bg-destructive/5">
              <CardContent className="flex flex-col items-center py-12">
                <XCircle className="h-16 w-16 text-destructive mb-4" />
                <h3 className="font-hindi font-bold text-xl text-foreground mb-2">
                  कोई रिकॉर्ड नहीं मिला
                </h3>
                <p className="font-hindi text-muted-foreground text-center">
                  कृपया सही नाम या रोल नंबर दर्ज करें और पुनः प्रयास करें
                </p>
              </CardContent>
            </Card>
          )}

          {!isSearching && results.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-6">
                <CheckCircle2 className="h-6 w-6 text-secondary" />
                <p className="font-hindi text-lg text-foreground">
                  <span className="font-semibold">{results.length}</span> रिकॉर्ड मिले
                </p>
              </div>

              {results.map((voter) => (
                <VoterCard key={voter.electoralNum} voter={voter} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function VoterCard({ voter }: { voter: Voter }) {
  return (
    <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-card overflow-hidden">
      <div className="h-1 bg-gradient-primary" />
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-hindi font-bold text-xl text-foreground mb-1">
              {voter.name}
            </h3>
            <p className="font-mono text-sm text-primary font-medium">
              {voter.rollNum}
            </p>
          </div>
          <div className="shrink-0 px-3 py-1 rounded-full bg-secondary/10 text-secondary font-hindi text-sm font-medium">
            सूची में उपलब्ध
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <InfoItem
            icon={Hash}
            label="चुनावी संख्या"
            value={voter.electoralNum}
          />
          <InfoItem
            icon={Calendar}
            label="नामांकन तिथि"
            value={voter.dateOfEnrolment}
          />
          <InfoItem
            icon={Building2}
            label="बार एसोसिएशन"
            value={voter.barAssociation}
          />
          <InfoItem
            icon={Scale}
            label="न्यायालय"
            value={voter.judgship}
          />
        </div>
      </CardContent>
    </Card>
  )
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 rounded-lg bg-muted shrink-0">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div>
        <p className="font-hindi text-sm text-muted-foreground">{label}</p>
        <p className="font-hindi font-medium text-foreground">{value}</p>
      </div>
    </div>
  )
}
