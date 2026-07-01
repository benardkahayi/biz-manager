"use client"

import { useState, useRef, useEffect, useTransition } from "react"
import { Search, Package, ShoppingCart, Receipt, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { globalSearch, SearchResult } from "@/services/search"

const CATEGORY_ICON = {
  Product: Package,
  Sale: ShoppingCart,
  Expense: Receipt,
} as const

const CATEGORY_COLOR = {
  Product: "text-blue-600 bg-blue-100",
  Sale: "text-green-600 bg-green-100",
  Expense: "text-red-600 bg-red-100",
} as const

export default function SearchBar() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const containerRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (query.trim().length < 2) {
      setResults([])
      setOpen(false)
      return
    }
    timerRef.current = setTimeout(() => {
      startTransition(async () => {
        const found = await globalSearch(query)
        setResults(found)
        setOpen(true)
      })
    }, 300)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [query])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function handleSelect(href: string) {
    setOpen(false)
    setQuery("")
    router.push(href)
  }

  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    if (!acc[r.category]) acc[r.category] = []
    acc[r.category].push(r)
    return acc
  }, {})

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="flex items-center gap-1.5 bg-gray-100 rounded-lg px-2.5 py-1.5">
        {isPending ? (
          <Loader2 size={14} className="text-gray-400 shrink-0 animate-spin" />
        ) : (
          <Search size={14} className="text-gray-400 shrink-0" />
        )}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
          placeholder="Search…"
          className="bg-transparent text-xs text-gray-700 placeholder:text-gray-400 outline-none w-full"
        />
      </div>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-full min-w-[320px] bg-white rounded-xl border shadow-lg z-50 overflow-hidden animate-fade-up">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-500">No results for &ldquo;{query}&rdquo;</p>
          ) : (
            Object.entries(grouped).map(([category, items]) => {
              const Icon = CATEGORY_ICON[category as keyof typeof CATEGORY_ICON]
              const color = CATEGORY_COLOR[category as keyof typeof CATEGORY_COLOR]
              return (
                <div key={category}>
                  <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-400 bg-gray-50 border-b">
                    {category}s
                  </div>
                  {items.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => handleSelect(r.href)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                    >
                      <span className={`rounded-lg p-1.5 ${color} shrink-0`}>
                        <Icon size={14} />
                      </span>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{r.label}</div>
                        <div className="text-xs text-gray-400 truncate">{r.sub}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
