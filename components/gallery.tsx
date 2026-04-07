"use client"

import { useState } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const galleryImages = [
  {
    src: "/assets/gallery/poster-1.png",
    alt: "\u091A\u0941\u0928\u093E\u0935 \u092A\u094D\u0930\u091A\u093E\u0930 \u092A\u094B\u0938\u094D\u091F\u0930",
    caption: "\u092A\u094D\u0930\u0925\u092E \u0935\u0930\u0940\u092F\u0924\u093E \u092E\u0924 \u0926\u0947\u0902",
  },
  {
    src: "/assets/gallery/poster-2.png",
    alt: "\u091A\u0941\u0928\u093E\u0935 \u092A\u094D\u0930\u091A\u093E\u0930 \u092A\u094B\u0938\u094D\u091F\u0930",
    caption: "\u092C\u093E\u0930 \u0915\u093E\u0909\u0902\u0938\u093F\u0932 \u0911\u092B \u0930\u093E\u091C\u0938\u094D\u0925\u093E\u0928 \u0938\u0926\u0938\u094D\u092F \u092A\u0926 \u0939\u0947\u0924\u0941",
  },
  {
    src: "/assets/gallery/poster-3.png",
    alt: "\u091A\u0941\u0928\u093E\u0935 \u092A\u094D\u0930\u091A\u093E\u0930 \u092A\u094B\u0938\u094D\u091F\u0930",
    caption: "\u092E\u0924\u0926\u093E\u0928 \u0938\u0902\u0916\u094D\u092F\u093E: 8",
  },
  {
    src: "/assets/campaign-poster.png",
    alt: "\u091A\u0941\u0928\u093E\u0935 \u092A\u094D\u0930\u091A\u093E\u0930 \u092A\u094B\u0938\u094D\u091F\u0930",
    caption: "\u092C\u0948\u0932\u091F \u0928\u0902\u092C\u0930 8 \u092A\u0930 \u0935\u094B\u091F \u0915\u0930\u0947\u0902",
  },
]

export function Gallery() {
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
      setSelectedImage(selectedImage === 0 ? galleryImages.length - 1 : selectedImage - 1)
    } else {
      setSelectedImage(selectedImage === galleryImages.length - 1 ? 0 : selectedImage + 1)
    }
  }

  return (
    <section id="gallery" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-hindi font-bold text-3xl md:text-4xl text-foreground mb-4" suppressHydrationWarning>
            {"\u091A\u0941\u0928\u093E\u0935 \u092A\u094D\u0930\u091A\u093E\u0930 \u0917\u0948\u0932\u0930\u0940"}
          </h2>
          <p className="font-hindi text-lg text-muted-foreground max-w-2xl mx-auto" suppressHydrationWarning>
            {"\u0939\u092E\u093E\u0930\u0947 \u091A\u0941\u0928\u093E\u0935 \u092A\u094D\u0930\u091A\u093E\u0930 \u0905\u092D\u093F\u092F\u093E\u0928 \u0915\u0940 \u091D\u0932\u0915\u093F\u092F\u093E\u0902"}
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="group relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300"
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
            </div>
          ))}
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
              <span className="sr-only">{"\u092C\u0902\u0926 \u0915\u0930\u0947\u0902"}</span>
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
              <span className="sr-only">{"\u092A\u093F\u091B\u0932\u0940 \u091B\u0935\u093F"}</span>
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
              <span className="sr-only">{"\u0905\u0917\u0932\u0940 \u091B\u0935\u093F"}</span>
            </Button>

            {/* Image Container */}
            <div 
              className="relative max-w-4xl max-h-[85vh] w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={galleryImages[selectedImage].src}
                alt={galleryImages[selectedImage].alt}
                fill
                className="object-contain"
              />
            </div>

            {/* Caption */}
            <div className="absolute bottom-8 left-0 right-0 text-center">
              <p className="font-hindi text-lg text-primary-foreground font-medium" suppressHydrationWarning>
                {galleryImages[selectedImage].caption}
              </p>
              <p className="font-hindi text-sm text-primary-foreground/70 mt-1">
                {selectedImage + 1} / {galleryImages.length}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
