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
          <div className="text-sm text-muted-foreground md:text-right">
            <p suppressHydrationWarning>
              &copy; {currentYear} Sh. Suresh Chandra Shrimali · Ballot 05
            </p>
            <p>
              Designed by{" "}
              <a
                href="https://github.com/Code-by-Mann"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Manasvi Shrimali
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
