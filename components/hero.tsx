"use client"

import Image from "next/image"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  const scrollToVoterSearch = () => {
    const element = document.getElementById("voter-search")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/banner.png"
          alt="Campaign Banner"
          fill
          className="object-cover"
          priority
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-hero" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 md:py-32">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-block px-4 py-2 rounded-full bg-primary-foreground/20 backdrop-blur-sm mb-4">
              <span className="font-hindi text-sm sm:text-base text-primary-foreground font-medium">
                {"\u092C\u0948\u0932\u091F \u0928\u0902\u092C\u0930 8 | \u091A\u0941\u0928\u093E\u0935 \u0924\u093F\u0925\u093F: 22 \u0905\u092A\u094D\u0930\u0948\u0932 2026"}
              </span>
            </div>
            <h1 className="font-hindi font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-primary-foreground leading-tight mb-6 text-balance">
              {"\u0936\u094D\u0930\u0940 \u0938\u0941\u0930\u0947\u0936 \u091A\u0902\u0926\u094D\u0930 \u0936\u094D\u0930\u0940\u092E\u093E\u0932\u0940 \u0915\u094B \u092A\u094D\u0930\u0925\u092E / \u0938\u0930\u094D\u0935\u094B\u091A\u094D\u091A \u0935\u0930\u0940\u092F\u0924\u093E \u0915\u093E \u092E\u0924 \u0926\u0947\u0915\u0930 \u0935\u093F\u091C\u092F\u0940 \u092C\u0928\u093E\u090F\u0902"}
            </h1>
            <p className="font-hindi text-base sm:text-lg text-primary-foreground/80 mb-2">
              {"\u0915\u094B-\u091A\u0947\u092F\u0930\u092E\u0948\u0928, \u092C\u093E\u0930 \u0915\u093E\u0909\u0902\u0938\u093F\u0932 \u0911\u092B \u0907\u0902\u0921\u093F\u092F\u093E | \u092A\u0942\u0930\u094D\u0935 \u091A\u0947\u092F\u0930\u092E\u0948\u0928, \u092C\u093E\u0930 \u0915\u093E\u0909\u0902\u0938\u093F\u0932 \u0911\u092B \u0930\u093E\u091C\u0938\u094D\u0925\u093E\u0928"}
            </p>
            <p className="font-hindi text-lg sm:text-xl md:text-2xl text-primary-foreground/90 mb-8">
              {"\u0906\u092A\u0915\u093E \u0938\u092E\u0930\u094D\u0925\u0928 \u0939\u0940 \u0939\u092E\u093E\u0930\u0940 \u0924\u093E\u0915\u0924 \u0939\u0948"}
            </p>
            <Button
              size="lg"
              onClick={scrollToVoterSearch}
              className="font-hindi text-lg px-8 py-6 bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              {"\u092E\u0924\u0926\u093E\u0924\u093E \u0938\u0942\u091A\u0940 \u092E\u0947\u0902 \u0905\u092A\u0928\u093E \u0928\u093E\u092E \u0916\u094B\u091C\u0947\u0902"}
            </Button>
          </div>

          {/* Candidate Image */}
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
            <div className="absolute inset-0 bg-primary-foreground/20 rounded-full blur-3xl" />
            <div className="relative w-full h-full rounded-2xl overflow-hidden border-4 border-primary-foreground/30 shadow-2xl">
              <Image
                src="/assets/profile-main.png"
                alt="श्री सुरेश चंद्र श्रीमाली"
                fill
                className="object-cover object-top"
                priority
              />
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-primary-foreground/70" />
        </div>
      </div>
    </section>
  )
}
