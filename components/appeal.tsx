"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

const APPEAL_TITLE = "आदरणीय साथियों से विनम्र निवेदन"

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
              {APPEAL_TITLE}
            </h2>
            <div className="font-hindi text-lg md:text-xl text-muted-foreground leading-relaxed space-y-6 text-center">
              <p>
                {"मैं, "}
                <span className="font-semibold text-primary">{"श्री सुरेश चंद्र श्रीमाली"}</span>
                {", "}
                <span className="text-foreground">{"को-चेयरमैन, बार काउंसिल ऑफ इंडिया"}</span>
                {" एवं "}
                <span className="text-foreground">{"पूर्व चेयरमैन, बार काउंसिल ऑफ राजस्थान"}</span>
                {", आगामी चुनाव में "}
                <span className="font-semibold text-primary">{"सदस्य बार काउंसिल ऑफ राजस्थान"}</span>
                {" के उम्मीदवार के रूप में आपके सामने उपस्थित हूं।"}
              </p>
              <p>
                {"आपसे विनम्र अनुरोध है कि "}
                <span className="font-semibold text-primary">{"बैलट नंबर 8"}</span>
                {" पर मुझे "}
                <span className="font-semibold text-primary">{"प्रथम / सर्वोच्च वरीयता का मत"}</span>
                {" देकर अपना समर्थन प्रदान करें।"}
              </p>
              <p className="font-medium text-foreground">
                {"चुनाव तिथि: "}
                <span className="text-primary font-bold">{"22 अप्रैल 2026 (बुधवार)"}</span>
              </p>
              <p className="text-base text-muted-foreground">
                {"नोट: वोटिंग के लिए "}
                <span className="font-semibold">{"बैलट नंबर 8"}</span>
                {" से पहले "}
                <span className="font-semibold">{"1"}</span>
                {" लिखें।"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
