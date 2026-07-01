import SaleForm from "@/components/sales/SaleForm"
import { prisma } from "@/lib/prisma"
import { ShoppingCart } from "lucide-react"

export default async function SalesPage() {
  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
  })

  return (
    <div>
      <div className="flex items-center gap-3 mb-6 animate-fade-up">
        <span className="bg-blue-100 text-blue-600 rounded-lg p-2.5">
          <ShoppingCart size={20} />
        </span>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Sales</h1>
          <p className="text-sm text-gray-500">Record a new sale</p>
        </div>
      </div>
      <SaleForm products={products} />
    </div>
  )
}
