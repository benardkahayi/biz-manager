import { createExpense, deleteExpense } from "@/services/expenses"
import { prisma } from "@/lib/prisma"
import { Receipt } from "lucide-react"

const CATEGORIES = ["rent", "salaries", "utilities", "transport", "supplies", "marketing", "other"]

export default async function ExpensesPage() {
  const expenses = await prisma.expense.findMany({
    orderBy: { expenseDate: "desc" },
    take: 50,
  })
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0)

  return (
    <div>
      <div className="flex items-center gap-3 mb-6 animate-fade-up">
        <span className="bg-red-100 text-red-600 rounded-lg p-2.5">
          <Receipt size={20} />
        </span>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Expenses</h1>
          <p className="text-sm text-gray-500">Track your business expenses</p>
        </div>
      </div>

      <form action={createExpense} className="mb-8 flex flex-wrap gap-3 items-end bg-white p-5 rounded-xl border shadow-sm animate-fade-up animation-delay-100">
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Category</label>
          <select name="category" required className="border rounded-lg px-3 py-2 capitalize focus:outline-none focus:ring-2 focus:ring-blue-500">
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col flex-1 min-w-48">
          <label className="text-sm text-gray-600 mb-1">Description</label>
          <input name="description" required className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Amount (TZS)</label>
          <input name="amount" type="number" min="0" required className="border rounded-lg px-3 py-2 w-32 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition-colors">
          Add Expense
        </button>
      </form>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden animate-fade-up animation-delay-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500 uppercase text-xs tracking-wide">
            <tr>
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Description</th>
              <th className="p-4 font-medium text-right">Amount (TZS)</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((e) => (
              <tr key={e.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="p-4 text-gray-600">{e.expenseDate.toLocaleDateString()}</td>
                <td className="p-4">
                  <span className="capitalize bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">{e.category}</span>
                </td>
                <td className="p-4 text-gray-900">{e.description}</td>
                <td className="p-4 text-right text-green-600">{e.amount.toLocaleString()}</td>
                <td className="p-4 text-right">
                  <form action={deleteExpense}>
                    <input type="hidden" name="id" value={e.id} />
                    <button type="submit" className="text-red-600 hover:underline text-sm">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {expenses.length === 0 && (
          <p className="p-6 text-gray-500 text-sm text-center">No expenses recorded yet.</p>
        )}
      </div>

      <div className="flex justify-end mt-4 animate-fade-up animation-delay-300">
        <div className="bg-red-50 border border-red-100 rounded-xl px-5 py-3">
          <span className="text-sm text-gray-500">Total Expenses: </span>
          <span className="text-lg font-semibold text-red-700">TZS {totalExpenses.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}