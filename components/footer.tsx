"use client"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-foreground py-8 pb-24 md:pb-8">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="font-hindi text-lg font-semibold text-background mb-2">
            श्री सुरेश चंद्र श्रीमाली
          </p>
          <p className="font-hindi text-sm text-background/70">
            &copy; {currentYear} | सभी अधिकार सुरक्षित
          </p>
        </div>
      </div>
    </footer>
  )
}
