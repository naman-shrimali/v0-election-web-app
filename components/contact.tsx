"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react"

const contactInfo = [
  {
    icon: Phone,
    label: "फोन नंबर 1",
    value: "+91 98291 26279",
    href: "tel:+919829126279",
  },
  {
    icon: Phone,
    label: "फोन नंबर 2",
    value: "+91 98292 09236",
    href: "tel:+919829209236",
  },
  {
    icon: MapPin,
    label: "कार्यालय पता",
    value: "अजमेर, राजस्थान",
    href: null,
  },
]

export function Contact() {
  return (
    <section id="contact" className="py-16 md:py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-hindi font-bold text-3xl md:text-4xl text-foreground mb-4">
            संपर्क करें
          </h2>
          <p className="font-hindi text-lg text-muted-foreground max-w-2xl mx-auto">
            किसी भी सहायता या जानकारी के लिए हमसे संपर्क करें
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {contactInfo.map((item, index) => (
              <Card
                key={index}
                className="border-none shadow-lg bg-card hover:shadow-xl transition-shadow"
              >
                <CardContent className="flex flex-col items-center text-center p-6">
                  <div className="p-4 rounded-full bg-primary/10 mb-4">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <p className="font-hindi text-sm text-muted-foreground mb-1">
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="font-hindi font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="font-hindi font-medium text-foreground">
                      {item.value}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* WhatsApp CTA */}
          <Card className="border-none shadow-xl bg-gradient-secondary overflow-hidden">
            <CardContent className="flex flex-col md:flex-row items-center justify-between gap-6 p-8">
              <div className="text-center md:text-left">
                <h3 className="font-hindi font-bold text-2xl text-secondary-foreground mb-2">
                  WhatsApp पर संपर्क करें
                </h3>
                <p className="font-hindi text-secondary-foreground/90">
                  त्वरित सहायता के लिए हमें WhatsApp पर मैसेज करें
                </p>
              </div>
              <Button
                asChild
                size="lg"
                className="font-hindi text-lg px-8 py-6 bg-card text-secondary hover:bg-card/90 shadow-lg"
              >
                <a
                  href="https://wa.me/919829126279?text=नमस्ते%2C%20मुझे%20चुनाव%20अभियान%20के%20बारे%20में%20जानकारी%20चाहिए।"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  WhatsApp पर मैसेज करें
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
