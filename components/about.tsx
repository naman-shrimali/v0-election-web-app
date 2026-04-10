"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Award, Heart, Users, Star, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const qualities = [
  {
    icon: Award,
    text: "बार काउंसिल ऑफ इंडिया के को-चेयरमैन (2018 से वर्तमान)",
  },
  {
    icon: Heart,
    text: "45+ वर्षों से गरीब व वंचित वर्ग को निःशुल्क कानूनी सहायता",
  },
  {
    icon: Users,
    text: "बार काउंसिल ऑफ राजस्थान के अध्यक्ष एवं उपाध्यक्ष रह चुके हैं",
  },
]

const workImages = [
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260408-WA0001-bj59ziI6hh88Wb4wZY9ageQ5N0WrFw.jpg",
    alt: "विनम्र अपील - पृष्ठ 1",
    caption: "बार कौंसिल ऑफ राजस्थान - विनम्र अपील",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260408-WA0002-8VoVpdZwVAeIDjZAvfMWYTCUyCF6x1.jpg",
    alt: "विनम्र अपील - पृष्ठ 2",
    caption: "कार्य एवं विजन डॉक्यूमेंट",
  },
]

export function About() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  const openLightbox = (index: number) => {
    setSelectedImage(index)
    document.body.style.overflow = "hidden"
  }

  const closeLightbox = () => {
    setSelectedImage(null)
    document.body.style.overflow = "auto"
  }

  const navigateImage = (direction: "prev" | "next") => {
    if (selectedImage === null) return

    if (direction === "prev") {
      setSelectedImage(selectedImage === 0 ? workImages.length - 1 : selectedImage - 1)
    } else {
      setSelectedImage(selectedImage === workImages.length - 1 ? 0 : selectedImage + 1)
    }
  }

  return (
    <section id="about" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="font-hindi font-bold text-3xl md:text-4xl text-center text-foreground mb-12" suppressHydrationWarning>
          {"\u0909\u092E\u094D\u092E\u0940\u0926\u0935\u093E\u0930 \u092A\u0930\u093F\u091A\u092F"}
        </h2>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-6xl mx-auto">
          {/* Image */}
          <div className="relative aspect-[4/5] max-w-md mx-auto lg:mx-0 w-full">
            <div className="absolute inset-0 bg-gradient-primary rounded-2xl transform rotate-3" />
            <div className="relative h-full rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/assets/newProfile.png"
                alt="श्री सुरेश चंद्र श्रीमाली"
                fill
                className="object-cover object-top"
              />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <Star className="h-6 w-6 text-primary fill-primary" />
              <h3 className="font-hindi font-bold text-2xl md:text-3xl text-foreground" suppressHydrationWarning>
                {"श्री सुरेश चंद्र श्रीमाली, एडवोकेट"}
              </h3>
            </div>

            <div className="space-y-4">
              {qualities.map((quality, index) => (
                <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow bg-card">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="p-3 rounded-full bg-primary/10 shrink-0">
                      <quality.icon className="h-6 w-6 text-primary" />
                    </div>
                    <p className="font-hindi text-lg text-foreground" suppressHydrationWarning>
                      {quality.text}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <p className="font-hindi text-xl text-center text-foreground font-medium italic" suppressHydrationWarning>
                  {"\"\u0906\u092A\u0915\u093E \u0935\u093F\u0936\u094D\u0935\u093E\u0938 \u0939\u0940 \u092E\u0947\u0930\u0940 \u0938\u092C\u0938\u0947 \u092C\u0921\u093C\u0940 \u0924\u093E\u0915\u0924 \u0939\u0948\""}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Work Highlights Section */}
        <div className="mt-16">
          <h3 className="font-hindi font-bold text-2xl md:text-3xl text-center text-foreground mb-8" suppressHydrationWarning>
            {"कार्य एवं उपलब्धियां"}
          </h3>
          <p className="font-hindi text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-8" suppressHydrationWarning>
            {"बार कौंसिल ऑफ राजस्थान के लिए किए गए कार्यों और भविष्य की योजनाओं का विस्तृत विवरण"}
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {workImages.map((image, index) => (
              <div
                key={index}
                className="group relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-primary/20"
                onClick={() => openLightbox(index)}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="font-hindi text-sm text-primary-foreground font-medium text-center" suppressHydrationWarning>
                    {image.caption}
                  </p>
                </div>
                <div className="absolute top-4 right-4 bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                  {"विस्तार से देखें"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lightbox */}
        {selectedImage !== null && (
          <div
            className="fixed inset-0 z-50 bg-foreground/95 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-primary-foreground hover:bg-primary-foreground/20 z-10"
              onClick={closeLightbox}
            >
              <X className="h-6 w-6" />
              <span className="sr-only">{"बंद करें"}</span>
            </Button>

            {/* Navigation Buttons */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-foreground hover:bg-primary-foreground/20 z-10"
              onClick={(e) => {
                e.stopPropagation()
                navigateImage("prev")
              }}
            >
              <ChevronLeft className="h-8 w-8" />
              <span className="sr-only">{"पिछली छवि"}</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-foreground hover:bg-primary-foreground/20 z-10"
              onClick={(e) => {
                e.stopPropagation()
                navigateImage("next")
              }}
            >
              <ChevronRight className="h-8 w-8" />
              <span className="sr-only">{"अगली छवि"}</span>
            </Button>

            {/* Image Container */}
            <div
              className="relative max-w-4xl max-h-[85vh] w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={workImages[selectedImage].src}
                alt={workImages[selectedImage].alt}
                fill
                className="object-contain"
              />
            </div>

            {/* Caption */}
            <div className="absolute bottom-8 left-0 right-0 text-center">
              <p className="font-hindi text-lg text-primary-foreground font-medium" suppressHydrationWarning>
                {workImages[selectedImage].caption}
              </p>
              <p className="font-hindi text-sm text-primary-foreground/70 mt-1">
                {selectedImage + 1} / {workImages.length}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
