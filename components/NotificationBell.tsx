"use client"

import { useState } from "react"
import { Bell } from "lucide-react"

type LowStockItem = {
  id: string
  name: string
  quantityInStock: number
  reorderLevel: number
}

export default function NotificationBell({ lowStock }: { lowStock: LowStockItem[] }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Bell size={20} className="text-gray-600" />
        {lowStock.length > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {lowStock.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl border shadow-lg z-50 overflow-hidden">
          <div className="px-4 py-3 border-b text-sm font-semibold text-gray-900">
            Low Stock Alerts
          </div>
          {lowStock.length === 0 ? (
            <p className="px-4 py-4 text-sm text-gray-500">Everything is well stocked.</p>
          ) : (
            <div className="max-h-72 overflow-auto">
              {lowStock.map((item) => (
                <div key={item.id} className="px-4 py-3 border-b last:border-0 flex items-center justify-between">
                  <span className="text-sm text-gray-900">{item.name}</span>
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                    {item.quantityInStock} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}