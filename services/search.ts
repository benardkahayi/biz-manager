"use server"

import { prisma } from "@/lib/prisma"

export type SearchResult = {
  id: string
  label: string
  sub: string
  category: "Product" | "Sale" | "Expense"
  href: string
}

export async function globalSearch(query: string): Promise<SearchResult[]> {
  if (!query || query.trim().length < 2) return []
  const q = query.trim()

  const [products, sales, expenses] = await Promise.all([
    prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { sku: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 4,
      select: { id: true, name: true, sku: true, quantityInStock: true },
    }),
    prisma.sale.findMany({
      where: { customerName: { contains: q, mode: "insensitive" } },
      take: 3,
      orderBy: { createdAt: "desc" },
      select: { id: true, customerName: true, totalAmount: true, saleDate: true },
    }),
    prisma.expense.findMany({
      where: {
        OR: [
          { description: { contains: q, mode: "insensitive" } },
          { category: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 3,
      orderBy: { expenseDate: "desc" },
      select: { id: true, description: true, category: true, amount: true },
    }),
  ])

  return [
    ...products.map((p) => ({
      id: p.id,
      label: p.name,
      sub: p.sku ? `SKU ${p.sku} · ${p.quantityInStock} in stock` : `${p.quantityInStock} in stock`,
      category: "Product" as const,
      href: "/products",
    })),
    ...sales.map((s) => ({
      id: s.id,
      label: s.customerName || "Walk-in",
      sub: `${s.saleDate.toLocaleDateString()} · TZS ${s.totalAmount.toLocaleString()}`,
      category: "Sale" as const,
      href: "/sales",
    })),
    ...expenses.map((e) => ({
      id: e.id,
      label: e.description,
      sub: `${e.category} · TZS ${e.amount.toLocaleString()}`,
      category: "Expense" as const,
      href: "/expenses",
    })),
  ]
}
