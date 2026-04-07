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
          <h2 className="font-hindi font-bold text-3xl md:text-4xl lg:text-5xl text-primary-foreground mb-6 leading-tight text-balance" suppressHydrationWarning>
            {"\u0906\u092A\u0915\u093E \u090F\u0915 \u0935\u094B\u091F \u092C\u0926\u0932\u093E\u0935 \u0915\u0940 \u0936\u0941\u0930\u0941\u0906\u0924 \u0939\u0948"}
          </h2>
          <p className="font-hindi text-xl md:text-2xl text-primary-foreground/90 mb-8" suppressHydrationWarning>
            {"\u0936\u094D\u0930\u0940 \u0938\u0941\u0930\u0947\u0936 \u091A\u0902\u0926\u094D\u0930 \u0936\u094D\u0930\u0940\u092E\u093E\u0932\u0940 \u0915\u094B \u092A\u094D\u0930\u0925\u092E / \u0938\u0930\u094D\u0935\u094B\u091A\u094D\u091A \u0935\u0930\u0940\u092F\u0924\u093E \u0915\u093E \u092E\u0924 \u0926\u0947\u0915\u0930 \u0935\u093F\u091C\u092F\u0940 \u092C\u0928\u093E\u090F\u0902"}
          </p>
          <Button
            size="lg"
            onClick={scrollToVoterSearch}
            className="font-hindi text-lg px-10 py-7 bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <Vote className="h-6 w-6 mr-2" />
            <span suppressHydrationWarning>{"\u0905\u092D\u0940 \u092E\u0924\u0926\u093E\u0924\u093E \u0938\u0942\u091A\u0940 \u091C\u093E\u0902\u091A\u0947\u0902"}</span>
          </Button>
        </div>
      </div>
    </section>
  )
}
