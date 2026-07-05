"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  LayoutDashboard,
  Package,
  PackagePlus,
  ShoppingCart,
  Receipt,
  BarChart2,
  FileText,
  FileSpreadsheet,
  Settings,
  Users,
  LogOut,
} from "lucide-react"

const navGroups = [
  {
    label: "Main Menu",
    items: [
      { name: "Dashboard",    href: "/dashboard",       icon: LayoutDashboard, color: "text-blue-500" },
      { name: "Inventory",    href: "/products",         icon: Package,         color: "text-blue-500" },
      { name: "Receive Stock",href: "/stock",            icon: PackagePlus,     color: "text-green-500" },
      { name: "Sales",        href: "/sales",            icon: ShoppingCart,    color: "text-emerald-500" },
      { name: "Expenses",     href: "/expenses",         icon: Receipt,         color: "text-red-500" },
    ],
  },
  {
    label: "Reports",
    items: [
      { name: "Analytics",    href: "/analytics",        icon: BarChart2,       color: "text-purple-500" },
      { name: "Reports",      href: "/reports",          icon: FileText,        color: "text-blue-500" },
      { name: "Excel Import", href: "/products/import",  icon: FileSpreadsheet, color: "text-green-500" },
      { name: "Settings",     href: "/settings",         icon: Settings,        color: "text-gray-500" },
      { name: "Users",        href: "/users",            icon: Users,           color: "text-blue-500", adminOnly: true },
    ],
  },
]

export default function Sidebar({
  storeName = "Lizy liquor store",
  role,
  onNavigate,
}: {
  storeName?: string
  role?: string
  onNavigate?: () => void
}) {
  const pathname = usePathname()

  const initials = storeName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()

  return (
    <aside className="w-56 min-h-screen bg-white border-r border-gray-200 text-gray-900 p-4 flex-shrink-0 flex flex-col">
      <div className="flex items-center gap-3 px-2 pb-8">
        <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {initials}
        </div>
        <span className="text-sm font-semibold leading-tight text-gray-900">{storeName}</span>
      </div>

      <nav className="flex flex-col gap-5">
        {navGroups.map((group) => (
          <div key={group.label}>
            <div className="px-3 mb-1 text-xs font-medium text-gray-400 uppercase tracking-wide">
              {group.label}
            </div>
            <div className="flex flex-col gap-1">
              {group.items
                .filter((item) => !item.adminOnly || role === "admin")
                .map(({ name, href, icon: Icon, color }) => {
                  const isActive = pathname === href
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={onNavigate}
                      className={
                        isActive
                          ? "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium bg-blue-600 text-white"
                          : "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      }
                    >
                      <Icon size={16} className={isActive ? "text-white" : color} />
                      {name}
                    </Link>
                  )
                })}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-auto pt-6">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 w-full rounded-md bg-red-50 hover:bg-red-100 px-3 py-2 text-sm font-medium text-red-600 transition-colors"
        >
          <LogOut size={16} className="text-red-500" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}