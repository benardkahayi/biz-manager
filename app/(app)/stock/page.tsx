import { receiveStock } from "@/services/stock"
import { prisma } from "@/lib/prisma"
import { PackagePlus } from "lucide-react"

export default async function StockPage() {
  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
  })

  const stockEntries = await prisma.stockEntry.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    include: { product: true },
  })

  return (
    <div>
      <div className="flex items-center gap-3 mb-6 animate-fade-up">
        <span className="bg-green-100 text-green-600 rounded-lg p-2.5">
          <PackagePlus size={20} />
        </span>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Receive Stock</h1>
          <p className="text-sm text-gray-500">Record new stock and update inventory cost</p>
        </div>
      </div>

      <form action={receiveStock} className="mb-8 flex flex-wrap gap-3 items-end bg-white p-5 rounded-xl border shadow-sm animate-fade-up animation-delay-100">
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Product</label>
          <select name="productId" required className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Select a product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Quantity</label>
          <input name="quantity" type="number" required min="1" className="border rounded-lg px-3 py-2 w-24 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Unit Cost (TZS)</label>
          <input name="unitCost" type="number" required min="0" className="border rounded-lg px-3 py-2 w-32 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Supplier</label>
          <input name="supplier" className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition-colors">
          Receive
        </button>
      </form>

      <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3 animate-fade-up animation-delay-200">Recent Stock Entries</h2>
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden animate-fade-up animation-delay-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500 uppercase text-xs tracking-wide">
            <tr>
              <th className="p-4 font-medium">Product</th>
              <th className="p-4 font-medium text-right">Quantity</th>
              <th className="p-4 font-medium text-right">Unit Cost</th>
              <th className="p-4 font-medium">Supplier</th>
            </tr>
          </thead>
          <tbody>
            {stockEntries.map((e) => (
              <tr key={e.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium text-gray-900">{e.product.name}</td>
                <td className="p-4 text-right text-gray-900">{e.quantity}</td>
                <td className="p-4 text-right text-green-600">{e.unitCost.toString()}</td>
                <td className="p-4 text-gray-600">{e.supplier || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {stockEntries.length === 0 && (
          <p className="p-6 text-gray-500 text-sm text-center">No stock received yet.</p>
        )}
      </div>
    </div>
  )
}
