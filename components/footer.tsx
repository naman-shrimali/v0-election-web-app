"use client"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-card py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-2 text-center md:flex-row md:items-center md:justify-between md:text-left">
          <p className="font-hindi text-sm font-semibold text-foreground" suppressHydrationWarning>
            Bar Council of Rajasthan Election 2026 Live Vote Count
          </p>
          <p className="text-sm text-muted-foreground" suppressHydrationWarning>
            &copy; {currentYear} Sh. Suresh Chandra Shrimali · Ballot 05
          </p>
        </div>
      </div>
    </footer>
  )
}
