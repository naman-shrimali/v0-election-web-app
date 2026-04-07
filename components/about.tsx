"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Award, Heart, Users, Star } from "lucide-react"

const qualities = [
  {
    icon: Award,
    text: "अनुभवी एवं समर्पित व्यक्तित्व",
  },
  {
    icon: Heart,
    text: "समाज के प्रति उत्तरदायित्व का गहरा अनुभव",
  },
  {
    icon: Users,
    text: "सभी वर्गों के हित में कार्य करने का संकल्प",
  },
]

export function About() {
  return (
    <section id="about" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="font-hindi font-bold text-3xl md:text-4xl text-center text-foreground mb-12">
          उम्मीदवार परिचय
        </h2>
        
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-6xl mx-auto">
          {/* Image */}
          <div className="relative aspect-[4/5] max-w-md mx-auto lg:mx-0 w-full">
            <div className="absolute inset-0 bg-gradient-primary rounded-2xl transform rotate-3" />
            <div className="relative h-full rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/assets/candidate/profile.jpg"
                alt="श्री सुरेश चंद्र श्रीमाली"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <Star className="h-6 w-6 text-primary fill-primary" />
              <h3 className="font-hindi font-bold text-2xl md:text-3xl text-foreground">
                श्री सुरेश चंद्र श्रीमाली
              </h3>
            </div>

            <div className="space-y-4">
              {qualities.map((quality, index) => (
                <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow bg-card">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="p-3 rounded-full bg-primary/10 shrink-0">
                      <quality.icon className="h-6 w-6 text-primary" />
                    </div>
                    <p className="font-hindi text-lg text-foreground">
                      {quality.text}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <p className="font-hindi text-xl text-center text-foreground font-medium italic">
                  &quot;आपका विश्वास ही मेरी सबसे बड़ी ताकत है&quot;
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
