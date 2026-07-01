import Link from "next/link"
import { Settings } from "lucide-react"
import NotificationBell from "@/components/NotificationBell"
import SearchBar from "@/components/SearchBar"
import PrintButton from "@/components/PrintButton"

type LowStockItem = {
  id: string
  name: string
  quantityInStock: number
  reorderLevel: number
}

export default function TopBar({
  userName,
  lowStock,
}: {
  userName: string
  lowStock: LowStockItem[]
}) {
  const initial = userName.charAt(0).toUpperCase()

  return (
    <header className="bg-white border-b px-6 py-3 flex items-center gap-4">
      <div className="w-56">
        <SearchBar />
      </div>

      <div className="flex items-center gap-2 ml-auto shrink-0">
        <PrintButton />
        <NotificationBell lowStock={lowStock} />

        <Link href="/settings" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Settings size={20} className="text-gray-600" />
        </Link>

        <div className="flex items-center gap-2 pl-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
            {initial}
          </div>
          <span className="text-sm font-medium text-gray-900">{userName}</span>
        </div>
      </div>
    </header>
  )
}