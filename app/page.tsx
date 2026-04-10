import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Appeal } from "@/components/appeal"
import { About } from "@/components/about"
import { Achievements } from "@/components/achievements"
import { Vision } from "@/components/vision"
import { Gallery } from "@/components/gallery"
import { VoterSearch } from "@/components/voter-search"
import { Contact } from "@/components/contact"
import { FinalCTA } from "@/components/final-cta"
import { Footer } from "@/components/footer"
import { WelcomeModal } from "@/components/welcome-modal"

export default function CampaignPage() {
  return (
    <main className="min-h-screen">
      <WelcomeModal />
      <Navbar />
      <Hero />
      <Appeal />
      <About />
      <Achievements />
      <Vision />
      <Gallery />
      <VoterSearch />
      <Contact />
      <FinalCTA />
      <Footer />
    </main>
  )
}
