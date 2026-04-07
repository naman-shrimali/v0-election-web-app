"use client"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-foreground py-8 pb-24 md:pb-8">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="font-hindi text-lg font-semibold text-background mb-2" suppressHydrationWarning>
            {"\u0936\u094D\u0930\u0940 \u0938\u0941\u0930\u0947\u0936 \u091A\u0902\u0926\u094D\u0930 \u0936\u094D\u0930\u0940\u092E\u093E\u0932\u0940"}
          </p>
          <p className="font-hindi text-sm text-background/70" suppressHydrationWarning>
            &copy; {currentYear} | {"\u0938\u092D\u0940 \u0905\u0927\u093F\u0915\u093E\u0930 \u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924"}
          </p>
        </div>
      </div>
    </footer>
  )
}
