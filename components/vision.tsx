"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Mic2, Shield, TrendingUp, HandHelping, Footprints } from "lucide-react"

const visionItems = [
  {
    icon: Mic2,
    title: "\u0939\u0930 \u0935\u094D\u092F\u0915\u094D\u0924\u093F \u0915\u0940 \u0906\u0935\u093E\u091C\u093C",
    description: "\u0939\u0930 \u0928\u093E\u0917\u0930\u093F\u0915 \u0915\u0940 \u092C\u093E\u0924 \u0938\u0941\u0928\u0940 \u091C\u093E\u090F\u0917\u0940 \u0914\u0930 \u0939\u0930 \u092E\u0941\u0926\u094D\u0926\u0947 \u0915\u094B \u092A\u094D\u0930\u093E\u0925\u092E\u093F\u0915\u0924\u093E \u0926\u0940 \u091C\u093E\u090F\u0917\u0940\u0964",
  },
  {
    icon: Shield,
    title: "\u092A\u093E\u0930\u0926\u0930\u094D\u0936\u0940 \u0935\u094D\u092F\u0935\u0938\u094D\u0925\u093E",
    description: "\u0939\u0930 \u0928\u093F\u0930\u094D\u0923\u092F \u0928\u093F\u0937\u094D\u092A\u0915\u094D\u0937, \u0938\u094D\u092A\u0937\u094D\u091F \u0914\u0930 \u091C\u0935\u093E\u092C\u0926\u0947\u0939 \u0939\u094B\u0917\u093E\u0964",
  },
  {
    icon: TrendingUp,
    title: "\u0935\u093F\u0915\u093E\u0938 \u0914\u0930 \u092A\u094D\u0930\u0917\u0924\u093F",
    description: "\u0938\u092D\u0940 \u0915\u0947 \u0932\u093F\u090F \u0938\u092E\u093E\u0928 \u0905\u0935\u0938\u0930 \u0914\u0930 \u0928\u093F\u0930\u0902\u0924\u0930 \u0935\u093F\u0915\u093E\u0938 \u0938\u0941\u0928\u093F\u0936\u094D\u091A\u093F\u0924 \u0915\u093F\u092F\u093E \u091C\u093E\u090F\u0917\u093E\u0964",
  },
  {
    icon: HandHelping,
    title: "\u0938\u0902\u0915\u091F \u092E\u0947\u0902 \u0938\u093E\u0925",
    description: "\u0939\u0930 \u092A\u0930\u093F\u0938\u094D\u0925\u093F\u0924\u093F \u092E\u0947\u0902 \u0906\u092A\u0915\u0947 \u0938\u093E\u0925 \u0916\u0921\u093C\u0947 \u0930\u0939\u0928\u0947 \u0915\u093E \u0935\u093E\u0926\u093E\u0964",
  },
  {
    icon: Footprints,
    title: "\u091C\u092E\u0940\u0928\u0940 \u0938\u094D\u0924\u0930 \u092A\u0930 \u0915\u093E\u0930\u094D\u092F",
    description: "\u0939\u0930 \u0915\u094D\u0937\u0947\u0924\u094D\u0930 \u092E\u0947\u0902 \u0938\u0915\u094D\u0930\u093F\u092F \u092D\u093E\u0917\u0940\u0926\u093E\u0930\u0940 \u0914\u0930 \u0928\u093F\u0930\u0902\u0924\u0930 \u0938\u0902\u092A\u0930\u094D\u0915\u0964",
  },
]

export function Vision() {
  return (
    <section id="vision" className="py-16 md:py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-hindi font-bold text-3xl md:text-4xl text-foreground mb-4" suppressHydrationWarning>
            {"\u0939\u092E\u093E\u0930\u093E \u0935\u093F\u091C\u093C\u0928"}
          </h2>
          <p className="font-hindi text-lg text-muted-foreground max-w-2xl mx-auto" suppressHydrationWarning>
            {"\u0906\u092A\u0915\u0947 \u0935\u093F\u0936\u094D\u0935\u093E\u0938 \u0915\u0947 \u0938\u093E\u0925, \u0939\u092E \u092E\u093F\u0932\u0915\u0930 \u090F\u0915 \u092C\u0947\u0939\u0924\u0930 \u0915\u0932 \u0915\u093E \u0928\u093F\u0930\u094D\u092E\u093E\u0923 \u0915\u0930\u0947\u0902\u0917\u0947"}
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
                <h3 className="font-hindi font-bold text-xl text-foreground" suppressHydrationWarning>
                  {item.title}
                </h3>
              </CardHeader>
              <CardContent>
                <p className="font-hindi text-muted-foreground leading-relaxed" suppressHydrationWarning>
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
