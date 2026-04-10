"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Award, Scale, BookOpen, Globe, Building2, Users } from "lucide-react"

const achievementSections = [
    {
        icon: Award,
        title: "प्रमुख उपलब्धियां",
        color: "from-orange-500 to-yellow-500",
        bgColor: "bg-orange-50 dark:bg-orange-950/20",
        borderColor: "border-orange-200 dark:border-orange-800",
        iconBg: "bg-orange-100 dark:bg-orange-900/40",
        iconColor: "text-orange-600 dark:text-orange-400",
        items: [
            "वर्ष 2012 में बेस्ट सिटिजन जर्नलिस्ट अवॉर्ड से सम्मानित",
            "बार काउंसिल ऑफ इंडिया के को-चेयरमैन (2018 से वर्तमान तक)",
            "बार काउंसिल ऑफ राजस्थान के अध्यक्ष (2008–2009)",
            "बार काउंसिल ऑफ राजस्थान के उपाध्यक्ष (2002–2003)",
            "माणिक्यलाल वर्मा राजकीय महाविद्यालय, भीलवाड़ा में मिलेनियम अध्यक्ष (2006 से लगातार)",
        ],
    },
    {
        icon: Scale,
        title: "बार काउंसिल सदस्यता",
        color: "from-blue-500 to-indigo-500",
        bgColor: "bg-blue-50 dark:bg-blue-950/20",
        borderColor: "border-blue-200 dark:border-blue-800",
        iconBg: "bg-blue-100 dark:bg-blue-900/40",
        iconColor: "text-blue-600 dark:text-blue-400",
        items: [
            "बार काउंसिल ऑफ राजस्थान के सदस्य: 1998–2003",
            "बार काउंसिल ऑफ राजस्थान के सदस्य: 2004–2009",
            "बार काउंसिल ऑफ राजस्थान के सदस्य: 2010–2018",
            "बार काउंसिल ऑफ राजस्थान के सदस्य: 2019 से वर्तमान तक",
            "जिला अधिवक्ता संघ, भीलवाड़ा — अध्यक्ष (1987–1988)",
            "जिला अधिवक्ता संघ, भीलवाड़ा — उपाध्यक्ष (1986–1987)",
            "जिला टेलीफोन सलाहकार समिति के सदस्य (1984–1989)",
        ],
    },
    {
        icon: BookOpen,
        title: "शैक्षणिक एवं पेशेवर योगदान",
        color: "from-emerald-500 to-teal-500",
        bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
        borderColor: "border-emerald-200 dark:border-emerald-800",
        iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
        iconColor: "text-emerald-600 dark:text-emerald-400",
        items: [
            "45+ वर्षों से न्यायिक क्षेत्र में सक्रिय वकालत",
            "गरीब, वंचित वर्ग, छात्रों एवं मजदूरों के लिए निःशुल्क कानूनी सहायता",
            "कई सफल जन आंदोलनों का नेतृत्व",
        ],
    },
    {
        icon: Globe,
        title: "राष्ट्रीय स्तर पर सहभागिता",
        color: "from-purple-500 to-pink-500",
        bgColor: "bg-purple-50 dark:bg-purple-950/20",
        borderColor: "border-purple-200 dark:border-purple-800",
        iconBg: "bg-purple-100 dark:bg-purple-900/40",
        iconColor: "text-purple-600 dark:text-purple-400",
        items: [
            "राष्ट्रीय विधि सम्मेलन, जोधपुर — सम्मानित अतिथि",
            "राष्ट्रीय विधि सम्मेलन, कोच्चि — सम्मानित अतिथि",
            "राष्ट्रीय विधि सम्मेलन, रांची — सम्मानित अतिथि",
            "राष्ट्रीय विधि सम्मेलन, चंडीगढ़ — सम्मानित अतिथि",
            "राष्ट्रीय विधि सम्मेलन, दिल्ली — सम्मानित अतिथि",
        ],
    },
    {
        icon: Building2,
        title: "सामाजिक एवं संस्थागत जुड़ाव",
        color: "from-rose-500 to-orange-500",
        bgColor: "bg-rose-50 dark:bg-rose-950/20",
        borderColor: "border-rose-200 dark:border-rose-800",
        iconBg: "bg-rose-100 dark:bg-rose-900/40",
        iconColor: "text-rose-600 dark:text-rose-400",
        items: [
            "राष्ट्रीय विधि विश्वविद्यालय, बेंगलुरु — जनरल काउंसिल सदस्य",
            "राष्ट्रीय विधि विश्वविद्यालय, शिमला — जनरल काउंसिल सदस्य",
            "राष्ट्रीय विधि विश्वविद्यालय, जोधपुर — जनरल काउंसिल सदस्य",
            "रोटरी क्लब, भीलवाड़ा के सक्रिय सदस्य",
        ],
    },
    {
        icon: Users,
        title: "अन्य प्रमुख कार्य",
        color: "from-cyan-500 to-blue-500",
        bgColor: "bg-cyan-50 dark:bg-cyan-950/20",
        borderColor: "border-cyan-200 dark:border-cyan-800",
        iconBg: "bg-cyan-100 dark:bg-cyan-900/40",
        iconColor: "text-cyan-600 dark:text-cyan-400",
        items: [
            "विभिन्न औद्योगिक संस्थानों के लिए अधिवक्ता के रूप में सेवाएं",
            "कंपनियों, स्कूलों एवं बैंकों के लिए कानूनी प्रतिनिधित्व",
        ],
    },
]

export function Achievements() {
    return (
        <section id="achievements" className="py-16 md:py-24 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-14">
                    <h2 className="font-hindi font-bold text-3xl md:text-4xl text-foreground mb-3">
                        {"उपलब्धियां एवं योगदान"}
                    </h2>
                    <p className="font-hindi text-lg text-muted-foreground max-w-2xl mx-auto">
                        {"45 वर्षों के अनुभव और राष्ट्रीय स्तर पर अनेक महत्वपूर्ण पदों पर सेवा"}
                    </p>
                    <div className="mt-4 mx-auto w-24 h-1 rounded-full bg-gradient-to-r from-orange-500 to-yellow-400" />
                </div>

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
                    {achievementSections.map((section, idx) => (
                        <Card
                            key={idx}
                            className={`border ${section.borderColor} ${section.bgColor} shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className={`p-3 rounded-xl ${section.iconBg} shrink-0`}>
                                        <section.icon className={`h-6 w-6 ${section.iconColor}`} />
                                    </div>
                                    <h3
                                        className={`font-hindi font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r ${section.color}`}
                                    >
                                        {section.title}
                                    </h3>
                                </div>
                                <ul className="space-y-2">
                                    {section.items.map((item, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 bg-gradient-to-r ${section.color}`} />
                                            <p className="font-hindi text-sm text-foreground/80 leading-relaxed">
                                                {item}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
