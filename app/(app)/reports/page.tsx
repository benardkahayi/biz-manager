import { getMonthlyReport } from "@/services/reports"
import { FileText } from "lucide-react"

export default async function ReportsPage() {
  const rows = await getMonthlyReport()

  return (
    <div>
      <div className="flex items-center gap-3 mb-6 animate-fade-up">
        <span className="bg-blue-100 text-blue-600 rounded-lg p-2.5">
          <FileText size={20} />
        </span>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
          <p className="text-sm text-gray-500">Monthly business performance</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden animate-fade-up animation-delay-100">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500 uppercase text-xs tracking-wide">
            <tr>
              <th className="p-4 font-medium">Month</th>
              <th className="p-4 font-medium text-right">Revenue</th>
              <th className="p-4 font-medium text-right">Cost of Goods</th>
              <th className="p-4 font-medium text-right">Expenses</th>
              <th className="p-4 font-medium text-right">Profit</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.month} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium text-gray-900">{r.month}</td>
                <td className="p-4 text-right text-green-600">{r.revenue.toLocaleString()}</td>
                <td className="p-4 text-right text-green-600">{r.cogs.toLocaleString()}</td>
                <td className="p-4 text-right text-green-600">{r.expenses.toLocaleString()}</td>
                <td className="p-4 text-right">
                  <span className={`font-medium px-2 py-1 rounded-full text-xs ${r.profit >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {r.profit.toLocaleString()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <p className="p-6 text-gray-500 text-sm text-center">No data yet. Record some sales and expenses to see reports.</p>
        )}
      </div>
    </div>
  )
}