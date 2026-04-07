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
          src="/assets/candidate/banner.jpg"
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
            <h1 className="font-hindi font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-primary-foreground leading-tight mb-6 text-balance">
              मुझे श्री सुरेश चंद्र श्रीमाली को प्रथम / सर्वोच्च वरीयता का मत देकर विजयी बनाएं
            </h1>
            <p className="font-hindi text-lg sm:text-xl md:text-2xl text-primary-foreground/90 mb-8">
              आपका समर्थन ही हमारी ताकत है
            </p>
            <Button
              size="lg"
              onClick={scrollToVoterSearch}
              className="font-hindi text-lg px-8 py-6 bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              मतदाता सूची में अपना नाम खोजें
            </Button>
          </div>

          {/* Candidate Image */}
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
            <div className="absolute inset-0 bg-primary-foreground/20 rounded-full blur-3xl" />
            <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-primary-foreground/30 shadow-2xl">
              <Image
                src="/assets/candidate/profile.jpg"
                alt="श्री सुरेश चंद्र श्रीमाली"
                fill
                className="object-cover"
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
