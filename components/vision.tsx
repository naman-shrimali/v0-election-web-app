"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Mic2, Shield, TrendingUp, HandHelping, Footprints } from "lucide-react"

const visionItems = [
  {
    icon: Mic2,
    title: "हर व्यक्ति की आवाज़",
    description: "हर नागरिक की बात सुनी जाएगी और हर मुद्दे को प्राथमिकता दी जाएगी।",
  },
  {
    icon: Shield,
    title: "पारदर्शी व्यवस्था",
    description: "हर निर्णय निष्पक्ष, स्पष्ट और जवाबदेह होगा।",
  },
  {
    icon: TrendingUp,
    title: "विकास और प्रगति",
    description: "सभी के लिए समान अवसर और निरंतर विकास सुनिश्चित किया जाएगा।",
  },
  {
    icon: HandHelping,
    title: "संकट में साथ",
    description: "हर परिस्थिति में आपके साथ खड़े रहने का वादा।",
  },
  {
    icon: Footprints,
    title: "जमीनी स्तर पर कार्य",
    description: "हर क्षेत्र में सक्रिय भागीदारी और निरंतर संपर्क।",
  },
]

export function Vision() {
  return (
    <section id="vision" className="py-16 md:py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-hindi font-bold text-3xl md:text-4xl text-foreground mb-4">
            हमारा विज़न
          </h2>
          <p className="font-hindi text-lg text-muted-foreground max-w-2xl mx-auto">
            आपके विश्वास के साथ, हम मिलकर एक बेहतर कल का निर्माण करेंगे
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {visionItems.map((item, index) => (
            <Card
              key={index}
              className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card group"
            >
              <CardHeader className="pb-2">
                <div className="p-4 rounded-xl bg-gradient-primary w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="font-hindi font-bold text-xl text-foreground">
                  {item.title}
                </h3>
              </CardHeader>
              <CardContent>
                <p className="font-hindi text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
