"use client"

import { useState, useEffect } from "react"
import { Menu, X, Search, User, MessageSquare, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "#home", label: "होम" },
  { href: "#about", label: "परिचय" },
  { href: "#vision", label: "विज़न" },
  { href: "#voter-search", label: "मतदाता खोजें" },
  { href: "#contact", label: "संपर्क" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("home")

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
      
      // Update active section based on scroll position
      const sections = navLinks.map(link => link.href.substring(1))
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
      {/* Desktop & Tablet Navbar */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled ? "glass shadow-lg" : "bg-transparent"
        )}
      >
        <nav className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection("#home")
              }}
              className={cn(
                "font-hindi font-bold text-lg md:text-xl transition-colors",
                isScrolled ? "text-foreground" : "text-primary-foreground"
              )}
            >
              श्री सुरेश चंद्र श्रीमाली
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection(link.href)
                  }}
                  className={cn(
                    "font-hindi text-sm font-medium transition-colors hover:text-primary",
                    isScrolled ? "text-foreground" : "text-primary-foreground",
                    activeSection === link.href.substring(1) && "text-primary"
                  )}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "md:hidden",
                isScrolled ? "text-foreground" : "text-primary-foreground"
              )}
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          <div
            className={cn(
              "md:hidden overflow-hidden transition-all duration-300",
              isOpen ? "max-h-96 mt-4" : "max-h-0"
            )}
          >
            <div className="glass rounded-lg p-4 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection(link.href)
                  }}
                  className={cn(
                    "block font-hindi text-base font-medium py-2 px-3 rounded-lg transition-colors",
                    activeSection === link.href.substring(1)
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-border safe-area-bottom">
        <div className="flex items-center justify-around py-2 px-2">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault()
              scrollToSection("#home")
            }}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors min-w-[60px]",
              activeSection === "home" ? "text-primary" : "text-muted-foreground"
            )}
          >
            <User className="h-5 w-5" />
            <span className="font-hindi text-xs">होम</span>
          </a>
          <a
            href="#voter-search"
            onClick={(e) => {
              e.preventDefault()
              scrollToSection("#voter-search")
            }}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors min-w-[60px]",
              activeSection === "voter-search" ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Search className="h-5 w-5" />
            <span className="font-hindi text-xs">खोजें</span>
          </a>
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors min-w-[60px] text-secondary"
          >
            <MessageSquare className="h-5 w-5" />
            <span className="font-hindi text-xs">WhatsApp</span>
          </a>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault()
              scrollToSection("#contact")
            }}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors min-w-[60px]",
              activeSection === "contact" ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Phone className="h-5 w-5" />
            <span className="font-hindi text-xs">संपर्क</span>
          </a>
        </div>
      </nav>
    </>
  )
}
