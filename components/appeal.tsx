"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

export function Appeal() {
  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto border-none shadow-xl bg-card">
          <CardContent className="p-8 md:p-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-primary/10">
                <Quote className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h2 className="font-hindi font-bold text-2xl md:text-3xl text-center text-foreground mb-8">
              आदरणीय साथियों से विनम्र निवेदन
            </h2>
            <div className="font-hindi text-lg md:text-xl text-muted-foreground leading-relaxed space-y-6 text-center">
              <p>
                मैं, <span className="font-semibold text-primary">श्री सुरेश चंद्र श्रीमाली</span>, आगामी चुनाव में उम्मीदवार के रूप में आपके सामने उपस्थित हूं।
              </p>
              <p>
                आपसे विनम्र अनुरोध है कि मुझे <span className="font-semibold text-primary">प्रथम / सर्वोच्च वरीयता का मत</span> देकर अपना समर्थन प्रदान करें।
              </p>
              <p className="font-medium text-foreground">
                आपका एक वोट न केवल मुझे, बल्कि पूरे समाज के विकास को नई दिशा देगा।
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
