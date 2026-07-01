"use client"

import { usePathname } from "next/navigation"
import { Printer } from "lucide-react"

const PRINTABLE = ["/reports", "/analytics", "/products"]

export default function PrintButton() {
  const pathname = usePathname()
  if (!PRINTABLE.includes(pathname)) return null

  return (
    <button
      onClick={() => window.print()}
      title="Print this page"
      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
    >
      <Printer size={20} className="text-gray-600" />
    </button>
  )
}
