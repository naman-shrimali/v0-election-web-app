import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Appeal } from "@/components/appeal"
import { About } from "@/components/about"
import { Vision } from "@/components/vision"
import { VoterSearch } from "@/components/voter-search"
import { Contact } from "@/components/contact"
import { FinalCTA } from "@/components/final-cta"
import { Footer } from "@/components/footer"

export default function CampaignPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Appeal />
      <About />
      <Vision />
      <VoterSearch />
      <Contact />
      <FinalCTA />
      <Footer />
    </main>
  )
}
