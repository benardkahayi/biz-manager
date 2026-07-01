import { prisma } from "@/lib/prisma"

export async function getMonthlyReport() {
  const saleItems = await prisma.saleItem.findMany({
    include: { sale: true },
  })
  const expenses = await prisma.expense.findMany()

  // Build a map: "YYYY-MM" -> { revenue, cogs, expenses }
  const months: Record<string, { revenue: number; cogs: number; expenses: number }> = {}

  function bucket(date: Date) {
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    if (!months[key]) {
      months[key] = { revenue: 0, cogs: 0, expenses: 0 }
    }
    return months[key]
  }

  for (const item of saleItems) {
    const b = bucket(item.sale.saleDate)
    b.revenue += Number(item.unitPrice) * item.quantity
    b.cogs += Number(item.unitCost) * item.quantity
  }

  for (const e of expenses) {
    const b = bucket(e.expenseDate)
    b.expenses += Number(e.amount)
  }

  // Turn the map into a sorted list (newest month first)
  const rows = Object.keys(months)
    .sort()
    .reverse()
    .map((key) => {
      const m = months[key]
      return {
        month: key,
        revenue: m.revenue,
        cogs: m.cogs,
        expenses: m.expenses,
        profit: m.revenue - m.cogs - m.expenses,
      }
    })

  return rows
}