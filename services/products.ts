"use server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"

export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string
  const sku = formData.get("sku") as string
  const sellingPrice = Number(formData.get("sellingPrice"))
  const reorderLevel = Number(formData.get("reorderLevel"))

  await prisma.product.create({
    data: {
      name: name,
      sku: sku || null,
      sellingPrice: BigInt(sellingPrice || 0),
      reorderLevel: reorderLevel || 5,
    },
  })

  revalidatePath("/products")
}

export async function deleteProduct(formData: FormData) {
  const id = formData.get("id") as string

  await prisma.product.delete({
    where: { id: id },
  })

  revalidatePath("/products")
}

export async function updateProduct(formData: FormData) {
  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const sku = formData.get("sku") as string
  const sellingPrice = Number(formData.get("sellingPrice"))
  const reorderLevel = Number(formData.get("reorderLevel"))

  await prisma.product.update({
    where: { id: id },
    data: {
      name: name,
      sku: sku || null,
      sellingPrice: BigInt(sellingPrice || 0),
      reorderLevel: reorderLevel || 5,
    },
  })

  revalidatePath("/products")
}

export async function bulkCreateProducts(
  rows: { Name?: string; SKU?: string; "Selling Price"?: number; "Reorder Level"?: number }[]
) {
  const imported: string[] = []
  const rejected: { row: number; reason: string }[] = []

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const rowNumber = i + 2 // +2 because row 1 is headers, and humans count from 1

    // --- Validation checks ---
    const name = typeof row.Name === "string" ? row.Name.trim() : ""
    if (!name) {
      rejected.push({ row: rowNumber, reason: "Missing product name" })
      continue
    }

    const price = Number(row["Selling Price"])
    if (row["Selling Price"] === undefined || isNaN(price)) {
      rejected.push({ row: rowNumber, reason: "Selling Price is missing or not a number" })
      continue
    }
    if (price < 0) {
      rejected.push({ row: rowNumber, reason: "Selling Price cannot be negative" })
      continue
    }

    const reorder = Number(row["Reorder Level"])
    const reorderLevel = isNaN(reorder) ? 5 : reorder

    // Duplicate check: skip if a product with this name already exists
    const existing = await prisma.product.findFirst({ where: { name: name } })
    if (existing) {
      rejected.push({ row: rowNumber, reason: `"${name}" already exists` })
      continue
    }

    // --- Passed all checks: create it ---
    await prisma.product.create({
      data: {
        name: name,
        sku: row.SKU ? String(row.SKU) : null,
        sellingPrice: BigInt(Math.round(price)),
        reorderLevel: reorderLevel,
      },
    })
    imported.push(name)
  }

  revalidatePath("/products")
  return { importedCount: imported.length, rejected: rejected }
}