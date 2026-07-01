"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"

type SaleItemInput = {
  productId: string
  quantity: number
}

export async function createSale(items: SaleItemInput[], customerName: string) {

// Look up each product from the database (never trust prices from the browser)
  const saleItemsData: { productId: string; quantity: number; unitPrice: bigint; unitCost: bigint }[] = []
  let total = 0

  for (const item of items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
    })

    if (!product) {
      throw new Error("Product not found")
    }

    if (item.quantity > product.quantityInStock) {
      throw new Error(`Not enough stock for ${product.name}`)
    }

    const unitPrice = product.sellingPrice
    const unitCost = product.avgCost

    saleItemsData.push({
      productId: product.id,
      quantity: item.quantity,
      unitPrice: unitPrice,
      unitCost: unitCost,
    })

    total += Number(unitPrice) * item.quantity
  }

  // Create the sale, its items, and reduce stock — all in one transaction
  await prisma.$transaction(async (tx) => {
    const sale = await tx.sale.create({
      data: {
        customerName: customerName || null,
        totalAmount: BigInt(total),
        paymentStatus: "paid",
      },
    })

    for (const itemData of saleItemsData) {
      await tx.saleItem.create({
        data: {
          saleId: sale.id,
          productId: itemData.productId,
          quantity: itemData.quantity,
          unitPrice: itemData.unitPrice,
          unitCost: itemData.unitCost,
        },
      })

      await tx.product.update({
        where: { id: itemData.productId },
        data: {
          quantityInStock: { decrement: itemData.quantity },
        },
      })
    }
  })

  revalidatePath("/sales")
  revalidatePath("/products")
}