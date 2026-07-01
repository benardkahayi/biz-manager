"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"

export async function createExpense(formData: FormData) {
  const category = formData.get("category") as string
  const description = formData.get("description") as string
  const amount = Number(formData.get("amount"))

  await prisma.expense.create({
    data: {
      category: category,
      description: description,
      amount: BigInt(amount || 0),
    },
  })

  revalidatePath("/expenses")
}

export async function deleteExpense(formData: FormData) {
  const id = formData.get("id") as string

  await prisma.expense.delete({
    where: { id: id },
  })

  revalidatePath("/expenses")
}