import { getMonthlyReport } from "@/services/reports"
import { prisma } from "@/lib/prisma"
import MonthlyChartWrapper from "@/components/MonthlyChartWrapper"
import { TrendingUp, Wallet, Receipt, BarChart2 } from "lucide-react"

export default async function AnalyticsPage() {
  const [months, topProducts] = await Promise.all([
    getMonthlyReport(),
    prisma.saleItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
  ])

  const productIds = topProducts.map((t) => t.productId)
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  })
  const productMap = Object.fromEntries(products.map((p) => [p.id, p.name]))

  const totalRevenue = months.reduce((s, m) => s + m.revenue, 0)
  const totalProfit = months.reduce((s, m) => s + m.profit, 0)
  const totalExpenses = months.reduce((s, m) => s + m.expenses, 0)

  const chartData = [...months].reverse().map((m) => ({
    month: m.month,
    revenue: m.revenue,
    profit: m.profit,
  }))

  const cards = [
    { label: "Total Revenue", value: totalRevenue.toLocaleString(), suffix: "TZS", icon: TrendingUp, iconBg: "bg-blue-100", iconColor: "text-blue-600", valueColor: "text-green-600", accent: "bg-blue-500" },
    { label: "Total Expenses", value: totalExpenses.toLocaleString(), suffix: "TZS", icon: Receipt, iconBg: "bg-red-100", iconColor: "text-red-600", valueColor: "text-green-600", accent: "bg-red-500" },
    { label: "Net Profit", value: totalProfit.toLocaleString(), suffix: "TZS", icon: Wallet, iconBg: "bg-green-100", iconColor: "text-green-600", valueColor: totalProfit >= 0 ? "text-green-600" : "text-red-600", accent: "bg-green-500" },
  ]

  return (
    <div>
      <div className="flex items-center gap-3 mb-6 animate-fade-up">
        <span className="bg-blue-100 text-blue-600 rounded-lg p-2.5">
          <BarChart2 size={20} />
        </span>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500">Business performance at a glance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {cards.map((c, i) => {
          const Icon = c.icon
          return (
            <div
              key={c.label}
              className={`bg-white rounded-xl border shadow-sm overflow-hidden animate-fade-up animation-delay-${(i + 1) * 100}`}
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

      <div className="animate-fade-up animation-delay-400">
        <MonthlyChartWrapper data={chartData} />
      </div>

      <div className="mt-6 bg-white rounded-xl border shadow-sm overflow-hidden animate-fade-up animation-delay-500">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Top 5 Products by Units Sold</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500 uppercase text-xs tracking-wide">
            <tr>
              <th className="p-4 font-medium">Product</th>
              <th className="p-4 font-medium text-right">Units Sold</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.map((t) => (
              <tr key={t.productId} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium text-gray-900">{productMap[t.productId] ?? "Unknown"}</td>
                <td className="p-4 text-right text-gray-900">{t._sum.quantity ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {topProducts.length === 0 && (
          <p className="p-6 text-gray-500 text-sm text-center">No sales data yet.</p>
        )}
      </div>
    </div>
  )
}
