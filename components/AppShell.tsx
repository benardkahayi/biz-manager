"use client"

import { useState } from "react"
import Sidebar from "@/components/sidebar"
import TopBar from "@/components/TopBar"

type LowStockItem = {
  id: string
  name: string
  quantityInStock: number
  reorderLevel: number
}

export default function AppShell({
  children,
  storeName,
  role,
  userName,
  lowStock,
}: {
  children: React.ReactNode
  storeName: string
  role?: string
  userName: string
  lowStock: LowStockItem[]
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      {/* Sidebar: fixed on desktop, slide-in overlay on mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar storeName={storeName} role={role} onNavigate={() => setSidebarOpen(false)} />
      </div>

      {/* Dark backdrop when sidebar is open on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar userName={userName} lowStock={lowStock} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 bg-gray-50 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  )
}