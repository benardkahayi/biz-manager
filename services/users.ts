"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { auth } from "@/auth"

export async function getUsers() {
  return prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true },
    orderBy: { email: "asc" },
  })
}

export async function createStaffUser(formData: FormData) {
  const session = await auth()
  if (session?.user?.role !== "admin") {
    throw new Error("Not authorized")
  }

  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const role = (formData.get("role") as string) || "staff"

  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: hashedPassword,
      role: role,
    },
  })

  revalidatePath("/users")
}
