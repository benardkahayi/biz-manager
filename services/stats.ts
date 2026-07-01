import { prisma } from "@/lib/prisma"

export async function getDashboardStats() {
  // All sale items (carry both price and cost)
  const saleItems = await prisma.saleItem.findMany()

  let revenue = 0
  let cogs = 0
  for (const item of saleItems) {
    revenue += Number(item.unitPrice) * item.quantity
    cogs += Number(item.unitCost) * item.quantity
  }

  // All expenses
  const expenses = await prisma.expense.findMany()
  let totalExpenses = 0
  for (const e of expenses) {
    totalExpenses += Number(e.amount)
  }

  const netProfit = revenue - cogs - totalExpenses

  // Product counts
  const productCount = await prisma.product.count()
  const lowStockCount = await prisma.product.count({
    where: { quantityInStock: { lte: 5 } },
  })

  return {
    revenue,
    cogs,
    totalExpenses,
    netProfit,
    productCount,
    lowStockCount,
  }
}