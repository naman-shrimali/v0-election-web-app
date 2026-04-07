"use client"

import { Button } from "@/components/ui/button"
import { Vote } from "lucide-react"

export function FinalCTA() {
  const scrollToVoterSearch = () => {
    const element = document.getElementById("voter-search")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-hero relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-foreground rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-foreground rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-hindi font-bold text-3xl md:text-4xl lg:text-5xl text-primary-foreground mb-6 leading-tight text-balance">
            आपका एक वोट बदलाव की शुरुआत है
          </h2>
          <p className="font-hindi text-xl md:text-2xl text-primary-foreground/90 mb-8">
            श्री सुरेश चंद्र श्रीमाली को प्रथम / सर्वोच्च वरीयता का मत देकर विजयी बनाएं
          </p>
          <Button
            size="lg"
            onClick={scrollToVoterSearch}
            className="font-hindi text-lg px-10 py-7 bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <Vote className="h-6 w-6 mr-2" />
            अभी मतदाता सूची जांचें
          </Button>
        </div>
      </div>
    </section>
  )
}
