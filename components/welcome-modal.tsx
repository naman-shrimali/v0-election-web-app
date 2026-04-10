"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { X } from "lucide-react"

export function WelcomeModal() {
    const [isOpen, setIsOpen] = useState(false)
    const [countdown, setCountdown] = useState(10)

    const handleClose = useCallback(() => {
        setIsOpen(false)
    }, [])

    // Open after a short delay so the page renders first
    useEffect(() => {
        const openTimer = setTimeout(() => setIsOpen(true), 400)
        return () => clearTimeout(openTimer)
    }, [])

    // Countdown + auto-close
    useEffect(() => {
        if (!isOpen) return

        if (countdown <= 0) {
            handleClose()
            return
        }

        const tick = setTimeout(() => setCountdown((c) => c - 1), 1000)
        return () => clearTimeout(tick)
    }, [isOpen, countdown, handleClose])

    if (!isOpen) return null

    const circumference = 2 * Math.PI * 18 // radius = 18
    const progress = ((10 - countdown) / 10) * circumference

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            onClick={handleClose}
            aria-modal="true"
            role="dialog"
            aria-label="चुनाव पोस्टर"
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm animate-in fade-in duration-300" />

            {/* Modal */}
            <div
                className="relative z-10 w-full max-w-lg md:max-w-2xl animate-in zoom-in-95 fade-in duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close & Countdown Button */}
                <div className="absolute -top-4 -right-4 z-20 flex items-center gap-2">
                    {/* Countdown ring */}
                    <div className="relative flex items-center justify-center w-10 h-10">
                        <svg className="absolute inset-0 w-10 h-10 -rotate-90" viewBox="0 0 44 44">
                            {/* Background ring */}
                            <circle
                                cx="22" cy="22" r="18"
                                fill="none"
                                stroke="rgba(255,255,255,0.2)"
                                strokeWidth="3"
                            />
                            {/* Progress ring */}
                            <circle
                                cx="22" cy="22" r="18"
                                fill="none"
                                stroke="white"
                                strokeWidth="3"
                                strokeDasharray={circumference}
                                strokeDashoffset={circumference - progress}
                                strokeLinecap="round"
                                className="transition-all duration-1000 ease-linear"
                            />
                        </svg>
                        <span className="relative text-white text-xs font-bold">{countdown}</span>
                    </div>

                    {/* Close button */}
                    <button
                        onClick={handleClose}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-xl transition-all duration-200 hover:scale-110 active:scale-95"
                        aria-label="बंद करें"
                    >
                        <X className="h-5 w-5 text-gray-800" />
                    </button>
                </div>

                {/* Poster Image */}
                <div className="rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20">
                    <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20260409_084230_WhatsApp-7V1ONodPRgDs5J92KWKnn0gwIjalD3.jpg"
                        alt="चुनाव प्रचार पोस्टर - श्री सुरेश चंद्र श्रीमाली"
                        width={800}
                        height={1000}
                        className="w-full h-auto"
                        priority
                    />
                </div>
            </div>
        </div>
    )
}
