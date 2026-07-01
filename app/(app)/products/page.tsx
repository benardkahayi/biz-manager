import EditProductButton from "@/components/EditProductButton"
import { createProduct, deleteProduct } from "@/services/products"
import { prisma } from "@/lib/prisma"
import { Package } from "lucide-react"

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <div className="flex items-center gap-3 mb-6 animate-fade-up">
        <span className="bg-blue-100 text-blue-600 rounded-lg p-2.5">
          <Package size={20} />
        </span>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500">Manage your product catalog</p>
        </div>
      </div>

      <form action={createProduct} className="mb-8 flex flex-wrap gap-3 items-end bg-white p-5 rounded-xl border shadow-sm animate-fade-up animation-delay-100">
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Name</label>
          <input name="name" required className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">SKU</label>
          <input name="sku" className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Selling Price (TZS)</label>
          <input name="sellingPrice" type="number" className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Reorder Level</label>
          <input name="reorderLevel" type="number" className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition-colors">
          Add Product
        </button>
      </form>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden animate-fade-up animation-delay-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500 uppercase text-xs tracking-wide">
            <tr>
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">SKU</th>
              <th className="p-4 font-medium text-right">Price (TZS)</th>
              <th className="p-4 font-medium text-right">In Stock</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium text-gray-900">{p.name}</td>
                <td className="p-4 text-gray-600">{p.sku || "—"}</td>
                <td className="p-4 text-right text-green-600">{p.sellingPrice.toLocaleString()}</td>
                <td className="p-4 text-right">
                  {p.quantityInStock <= p.reorderLevel ? (
                    <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                      {p.quantityInStock} low
                    </span>
                  ) : (
                    <span className="text-gray-900">{p.quantityInStock}</span>
                  )}
                </td>
                <td className="p-4 text-right">
                  <div className="flex gap-3 justify-end items-center">
                    <EditProductButton product={p} />
                    <form action={deleteProduct}>
                      <input type="hidden" name="id" value={p.id} />
                      <button type="submit" className="text-red-600 hover:underline text-sm">
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="p-6 text-gray-500 text-sm text-center">No products yet. Add one above.</p>
        )}
      </div>
    </div>
  )
}