"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"

export async function getBusinessProfile() {
  // There's only ever one profile row; create a blank one if none exists
  let profile = await prisma.businessProfile.findFirst()
  if (!profile) {
    profile = await prisma.businessProfile.create({ data: {} })
  }
  return profile
}

export async function updateBusinessProfile(_prev: unknown, formData: FormData) {
  const storeName = formData.get("storeName") as string
  const address = formData.get("address") as string
  const phone = formData.get("phone") as string
  const currency = formData.get("currency") as string

  const existing = await prisma.businessProfile.findFirst()

  if (existing) {
    await prisma.businessProfile.update({
      where: { id: existing.id },
      data: { storeName, address, phone, currency },
    })
  } else {
    await prisma.businessProfile.create({
      data: { storeName, address, phone, currency },
    })
  }

  revalidatePath("/settings")
  return { success: true }
}
