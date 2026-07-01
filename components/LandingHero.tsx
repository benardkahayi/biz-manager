"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

const words = ["Sales.", "Stock.", "Expenses.", "Profits."]

export default function LandingHero({ userName }: { userName?: string | null }) {
  const [wordIndex, setWordIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % words.length)
        setVisible(true)
      }, 400)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden"
      style={{
        backgroundImage: "url('/bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay so text stays readable */}
      <div className="absolute inset-0 bg-black/65 backdrop-blur-[1px] pointer-events-none" />

      {/* Logo badge */}
      <div className="animate-fade-up mb-6 w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-amber-500/30">
        LL
      </div>

      {/* Store name */}
      <p className="animate-fade-up animation-delay-100 text-amber-400 text-sm font-semibold tracking-widest uppercase mb-3">
        Lizy Liquor Store
      </p>

      {/* Main heading */}
      <h1 className="animate-fade-up animation-delay-200 text-4xl sm:text-6xl font-bold text-white text-center leading-tight mb-2">
        Manage Your
      </h1>
      <h2 className="text-4xl sm:text-6xl font-bold text-center mb-6 h-16 sm:h-20 flex items-center justify-center">
        <span
          className={`text-amber-400 transition-all duration-400 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
          }`}
          style={{ transition: "opacity 0.4s ease, transform 0.4s ease" }}
        >
          {words[wordIndex]}
        </span>
      </h2>

      {/* Subtitle */}
      <p className="animate-fade-up animation-delay-300 text-slate-400 text-base sm:text-lg text-center max-w-md mb-10">
        All-in-one business tool for tracking stock, recording sales, managing expenses and viewing profit — in TZS.
      </p>

      {/* Feature pills */}
      <div className="animate-fade-up animation-delay-400 flex flex-wrap gap-2 justify-center mb-10">
        {["📦 Inventory", "🧾 Sales", "💸 Expenses", "📊 Analytics", "📁 Reports"].map((f) => (
          <span key={f} className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
            {f}
          </span>
        ))}
      </div>

      {/* CTA */}
      <div className="animate-fade-up animation-delay-500 flex flex-col sm:flex-row gap-3">
        {userName ? (
          <Link
            href="/dashboard"
            className="rounded-xl bg-amber-500 hover:bg-amber-400 px-8 py-3 text-white font-semibold text-sm shadow-lg shadow-amber-500/30 transition-all hover:scale-105"
          >
            Go to Dashboard →
          </Link>
        ) : (
          <>
            <Link
              href="/login"
              className="rounded-xl bg-amber-500 hover:bg-amber-400 px-8 py-3 text-white font-semibold text-sm shadow-lg shadow-amber-500/30 transition-all hover:scale-105"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="rounded-xl border border-white/20 hover:border-white/40 px-8 py-3 text-white font-semibold text-sm transition-all hover:bg-white/5"
            >
              Create Account
            </Link>
          </>
        )}
      </div>

      {/* Bottom tagline */}
      <p className="animate-fade-up animation-delay-600 text-slate-600 text-xs mt-12">
        Built for Tanzanian small businesses
      </p>
    </main>
  )
}
