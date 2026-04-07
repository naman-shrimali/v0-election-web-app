"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Award, Heart, Users, Star } from "lucide-react"

const qualities = [
  {
    icon: Award,
    text: "\u0905\u0928\u0941\u092D\u0935\u0940 \u090F\u0935\u0902 \u0938\u092E\u0930\u094D\u092A\u093F\u0924 \u0935\u094D\u092F\u0915\u094D\u0924\u093F\u0924\u094D\u0935",
  },
  {
    icon: Heart,
    text: "\u0938\u092E\u093E\u091C \u0915\u0947 \u092A\u094D\u0930\u0924\u093F \u0909\u0924\u094D\u0924\u0930\u0926\u093E\u092F\u093F\u0924\u094D\u0935 \u0915\u093E \u0917\u0939\u0930\u093E \u0905\u0928\u0941\u092D\u0935",
  },
  {
    icon: Users,
    text: "\u0938\u092D\u0940 \u0935\u0930\u094D\u0917\u094B\u0902 \u0915\u0947 \u0939\u093F\u0924 \u092E\u0947\u0902 \u0915\u093E\u0930\u094D\u092F \u0915\u0930\u0928\u0947 \u0915\u093E \u0938\u0902\u0915\u0932\u094D\u092A",
  },
]

export function About() {
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
                src="/assets/profile-main.png"
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
                {"\u0936\u094D\u0930\u0940 \u0938\u0941\u0930\u0947\u0936 \u091A\u0902\u0926\u094D\u0930 \u0936\u094D\u0930\u0940\u092E\u093E\u0932\u0940"}
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
      </div>
    </section>
  )
}
