import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function POST(req: Request) {
  try {
    // TEMPORARILY DISABLED FOR EMERGENCY ACCESS - RE-ENABLE AFTER LOGGING IN!
    // const session = await auth()
    // if (session?.user?.role !== "admin") {
    //   return NextResponse.json({ message: "Not authorized" }, { status: 403 })
    // }

    const body = await req.json()
    const { email, password, name } = body

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })
    if (existingUser) {
      return NextResponse.json({ message: "Email already in use" }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ message: "Signup failed" }, { status: 500 })
  }
}