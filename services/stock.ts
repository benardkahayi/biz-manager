"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"

export async function receiveStock(formData: FormData) {
  const productId = formData.get("productId") as string
  const quantity = Number(formData.get("quantity"))
  const unitCost = Number(formData.get("unitCost"))
  const supplier = formData.get("supplier") as string

  // Get the product's current stock and average cost
  const product = await prisma.product.findUnique({
    where: { id: productId },
  })

  if (!product) {
    throw new Error("Product not found")
  }

  const oldQuantity = product.quantityInStock
  const oldAvgCost = Number(product.avgCost)

  // Weighted average cost calculation
  const totalQuantity = oldQuantity + quantity
  const newAvgCost = totalQuantity === 0
    ? 0
    : Math.round((oldQuantity * oldAvgCost + quantity * unitCost) / totalQuantity)

  // Save the stock entry AND update the product together (transaction)
  await prisma.$transaction([
    prisma.stockEntry.create({
      data: {
        productId: productId,
        quantity: quantity,
        unitCost: BigInt(unitCost),
        supplier: supplier || null,
      },
    }),
    prisma.product.update({
      where: { id: productId },
      data: {
        quantityInStock: totalQuantity,
        avgCost: BigInt(newAvgCost),
      },
    }),
  ])

  revalidatePath("/stock")
  revalidatePath("/products")
}