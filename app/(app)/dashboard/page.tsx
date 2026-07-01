import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getDashboardStats } from "@/services/stats"
import { getMonthlyReport } from "@/services/reports"
import { prisma } from "@/lib/prisma"
import MonthlyChartWrapper from "@/components/MonthlyChartWrapper"
import { TrendingUp, Wallet, Receipt, Package } from "lucide-react"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) {
    redirect("/login")
  }

  const [stats, rows, profile] = await Promise.all([
    getDashboardStats(),
    getMonthlyReport(),
    prisma.businessProfile.findFirst(),
  ])
  const storeName = profile?.storeName || "Your Store"
  const chartData = [...rows].reverse().map((r) => ({
    month: r.month,
    revenue: r.revenue,
    profit: r.profit,
  }))

  const recentSales = await prisma.sale.findMany({
    orderBy: { createdAt: "desc" },
    take: 6,
  })

  const cards = [
    { label: "Total Revenue", value: stats.revenue.toLocaleString(), suffix: "TZS", icon: TrendingUp, iconBg: "bg-blue-100", iconColor: "text-blue-600", valueColor: "text-green-600", accent: "bg-blue-500" },
    { label: "Net Profit", value: stats.netProfit.toLocaleString(), suffix: "TZS", icon: Wallet, iconBg: "bg-green-100", iconColor: "text-green-600", valueColor: stats.netProfit >= 0 ? "text-green-600" : "text-red-600", accent: "bg-green-500" },
    { label: "Total Expenses", value: stats.totalExpenses.toLocaleString(), suffix: "TZS", icon: Receipt, iconBg: "bg-red-100", iconColor: "text-red-600", valueColor: "text-green-600", accent: "bg-red-500" },
    { label: "Products", value: stats.productCount.toString(), suffix: stats.lowStockCount > 0 ? `${stats.lowStockCount} low on stock` : "all well stocked", icon: Package, iconBg: "bg-blue-100", iconColor: "text-blue-600", valueColor: "text-gray-900", accent: "bg-amber-500" },
  ]

  const initials = storeName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()

  return (
    <div>
      <div className="flex items-center gap-3 mb-1 animate-fade-up">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0">
          {initials}
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{storeName}</h1>
          <p className="text-sm text-gray-500">
            Welcome back, {session.user.name || session.user.email}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 mt-6">
        {cards.map((c, i) => {
          const Icon = c.icon
          return (
            <div
              key={c.label}
              className={`bg-white rounded-xl border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden animate-fade-up animation-delay-${(i + 1) * 100}`}
            >
              <div className={`h-1 ${c.accent}`} />
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium uppercase tracking-wide text-gray-500">{c.label}</span>
                  <span className={`${c.iconBg} ${c.iconColor} rounded-lg p-2`}>
                    <Icon size={18} />
                  </span>
                </div>
                <div className={`text-2xl font-semibold ${c.valueColor}`}>
                  {c.value}
                </div>
                <div className="text-xs text-gray-400 mt-1">{c.suffix}</div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 animate-fade-up animation-delay-500">
          {chartData.length > 0 ? (
            <MonthlyChartWrapper data={chartData} />
          ) : (
            <div className="bg-white rounded-xl border shadow-sm p-10 flex flex-col items-center justify-center text-center">
              <span className="bg-blue-100 text-blue-600 rounded-full p-3 mb-3">
                <TrendingUp size={20} />
              </span>
              <p className="text-gray-500 text-sm">No sales data yet</p>
              <p className="text-gray-400 text-xs mt-1">Charts appear once you record sales</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border shadow-sm p-5 animate-fade-up animation-delay-600">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-4">Recent Sales</h2>
          {recentSales.length === 0 ? (
            <p className="text-gray-400 text-sm">No sales yet.</p>
          ) : (
            <div className="flex flex-col gap-1">
              {recentSales.map((s) => {
                const label = s.customerName || "Walk-in"
                const saleInitials = label
                  .split(" ")
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join("")
                  .toUpperCase()
                return (
                  <div
                    key={s.id}
                    className="flex items-center gap-3 text-sm py-2 px-1 -mx-1 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                      {saleInitials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">{label}</div>
                      <div className="text-xs text-gray-400">{s.saleDate.toLocaleDateString()}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-medium text-green-600">{s.totalAmount.toLocaleString()}</div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        s.paymentStatus === "paid" ? "bg-green-100 text-green-700" :
                        s.paymentStatus === "pending" ? "bg-amber-100 text-amber-700" :
                        "bg-gray-100 text-gray-600"
                      }`}>
                        {s.paymentStatus}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}