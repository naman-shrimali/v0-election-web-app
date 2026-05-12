import { Navbar } from "@/components/navbar"
import { LiveResults } from "@/components/live-results"
import { Footer } from "@/components/footer"

export default function LiveCountingPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <LiveResults />
      <Footer />
    </main>
  )
}
