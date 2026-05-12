"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { BarChart3, Bell, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { href: "#live-count", label: "Live Count", icon: BarChart3 },
  { href: "#counting-notice", label: "Notice", icon: Bell },
] as const

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("live-count")

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)

      const sections = NAV_LINKS.map(link => link.href.substring(1))
      for (const section of sections.reverse()) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsOpen(false)
  }

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300",
          isScrolled ? "glass shadow-sm" : "bg-white/95 backdrop-blur"
        )}
      >
        <nav className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <a
              href="#live-count"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection("#live-count")
              }}
              className="flex items-center gap-3"
            >
              <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-primary/30">
                <Image
                  src="/assets/logo.png"
                  alt="Sh. Suresh Chandra Shrimali"
                  fill
                  className="object-cover"
                />
              </div>
              <span className={cn(
                "font-hindi font-bold text-lg md:text-xl transition-colors hidden sm:block",
                "text-foreground"
              )}>
                Live Vote Count
              </span>
            </a>

            <div className="hidden md:flex items-center gap-6">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection(link.href)
                  }}
                  className={cn(
                    "inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-primary",
                    activeSection === link.href.substring(1) && "text-primary"
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </a>
              ))}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          <div
            className={cn(
              "md:hidden overflow-hidden transition-all duration-300",
              isOpen ? "max-h-96 mt-4" : "max-h-0"
            )}
          >
            <div className="glass rounded-lg p-4 space-y-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection(link.href)
                  }}
                  className={cn(
                    "flex items-center gap-2 text-base font-medium py-2 px-3 rounded-lg transition-colors",
                    activeSection === link.href.substring(1)
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </nav>
      </header>
    </>
  )
}
