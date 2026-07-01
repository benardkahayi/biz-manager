import Sidebar from "@/components/sidebar"
import TopBar from "@/components/TopBar"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  const userName = session?.user?.name || session?.user?.email || "User"

  const lowStock = await prisma.product.findMany({
    where: {
      isActive: true,
      quantityInStock: { lte: prisma.product.fields.reorderLevel },
    },
    select: {
      id: true,
      name: true,
      quantityInStock: true,
      reorderLevel: true,
    },
    orderBy: { quantityInStock: "asc" },
  })

  const profile = await prisma.businessProfile.findFirst()
  const storeName = profile?.storeName || "BizSmart"

  return (
    <div className="flex min-h-screen">
      <Sidebar storeName={storeName} />
      <div className="flex-1 flex flex-col">
        <TopBar userName={userName} lowStock={lowStock} />
        <main className="flex-1 bg-gray-50 p-6">{children}</main>
      </div>
    </div>
  )
}