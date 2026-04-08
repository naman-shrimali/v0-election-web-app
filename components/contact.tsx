"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react"

const contactInfo = [
  {
    icon: Phone,
    label: "\u092B\u094B\u0928 \u0928\u0902\u092C\u0930 1",
    value: "+91 98291 26279",
    href: "tel:+919829126279",
  },
  {
    icon: Phone,
    label: "\u092B\u094B\u0928 \u0928\u0902\u092C\u0930 2",
    value: "+91 98292 09236",
    href: "tel:+919829209236",
  },
  {
    icon: Mail,
    label: "\u0908\u092E\u0947\u0932",
    value: "eradvdeep@gmail.com",
    href: "mailto:eradvdeep@gmail.com",
  },
  {
    icon: MapPin,
    label: "\u0915\u093E\u0930\u094D\u092F\u093E\u0932\u092F \u092A\u0924\u093E",
    value: "\u092D\u0940\u0932\u0935\u093E\u0921\u093C\u093E, \u0930\u093E\u091C\u0938\u094D\u0925\u093E\u0928",
    href: null,
  },
]

const fullMessage = `आदरणीय अधिवक्ता साथियों,

सुरेश चंद्र श्रीमाली बैलेट नंबर 08 का आप सभी से विनम्र निवेदन है कि अपना व अपने मिलने वाले अधिवक्ता साथियों का https://sureshchandrashrimali.vercel.app/ पर मतदाता सूची में नाम सनद नम्बर व नाम से चैक करें और अधिक से अधिक अधिवक्ताओं तक साझा करें। एक छोटे से प्रयास से आपको सहयोग हो सकें। आइए, हम सब मिलकर एकजुट होकर सफलता की ओर बढ़ें।

आपका हितैषी 
सुरेश चंद्र श्रीमाली 
बैलेट नंबर 08

9829126279
9829209236`;

export function Contact() {
  return (
    <section id="contact" className="py-16 md:py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-hindi font-bold text-3xl md:text-4xl text-foreground mb-4" suppressHydrationWarning>
            {"\u0938\u0902\u092A\u0930\u094D\u0915 \u0915\u0930\u0947\u0902"}
          </h2>
          <p className="font-hindi text-lg text-muted-foreground max-w-2xl mx-auto" suppressHydrationWarning>
            {"\u0915\u093F\u0938\u0940 \u092D\u0940 \u0938\u0939\u093E\u092F\u0924\u093E \u092F\u093E \u091C\u093E\u0928\u0915\u093E\u0930\u0940 \u0915\u0947 \u0932\u093F\u090F \u0939\u092E\u0938\u0947 \u0938\u0902\u092A\u0930\u094D\u0915 \u0915\u0930\u0947\u0902"}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {contactInfo.map((item, index) => (
              <Card
                key={index}
                className="border-none shadow-lg bg-card hover:shadow-xl transition-shadow"
              >
                <CardContent className="flex flex-col items-center text-center p-6">
                  <div className="p-4 rounded-full bg-primary/10 mb-4">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <p className="font-hindi text-sm text-muted-foreground mb-1" suppressHydrationWarning>
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
                    <p className="font-hindi font-medium text-foreground" suppressHydrationWarning>
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
                <h3 className="font-hindi font-bold text-2xl text-secondary-foreground mb-2" suppressHydrationWarning>
                  {"\u0935\u094D\u0939\u093E\u091F\u094D\u0938\u090F\u092A \u092A\u0930 \u0938\u0902\u092A\u0930\u094D\u0915 \u0915\u0930\u0947\u0902"}
                </h3>
                <p className="font-hindi text-secondary-foreground/90" suppressHydrationWarning>
                  {"\u0924\u094D\u0935\u0930\u093F\u0924 \u0938\u0939\u093E\u092F\u0924\u093E \u0915\u0947 \u0932\u093F\u090F \u0939\u092E\u0947\u0902 \u0935\u094D\u0939\u093E\u091F\u094D\u0938\u090F\u092A \u092A\u0930 \u092E\u0948\u0938\u0947\u091C \u0915\u0930\u0947\u0902"}
                </p>
              </div>
              <Button
                asChild
                size="lg"
                className="font-hindi text-lg px-8 py-6 bg-card text-secondary hover:bg-card/90 shadow-lg"
              >
                <a
                  href={`https://wa.me/919829126279?text=${encodeURIComponent(fullMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  <span suppressHydrationWarning>{"\u0935\u094D\u0939\u093E\u091F\u094D\u0938\u090F\u092A \u092A\u0930 \u092E\u0948\u0938\u0947\u091C \u0915\u0930\u0947\u0902"}</span>
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
