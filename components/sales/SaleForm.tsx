"use client"

import { useState } from "react"
import { createSale } from "@/services/sales"
import { ShoppingCart } from "lucide-react"

type Product = {
  id: string
  name: string
  sellingPrice: bigint
  quantityInStock: number
}

type BasketItem = {
  productId: string
  name: string
  price: number
  quantity: number
}

export default function SaleForm({ products }: { products: Product[] }) {
  const [basket, setBasket] = useState<BasketItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [customerName, setCustomerName] = useState("")
  const [saving, setSaving] = useState(false)

  function addToBasket() {
    if (!selectedProduct) return
    const product = products.find((p) => p.id === selectedProduct)
    if (!product) return
    if (quantity > product.quantityInStock) {
      alert(`Only ${product.quantityInStock} in stock for ${product.name}`)
      return
    }
    setBasket([
      ...basket,
      {
        productId: product.id,
        name: product.name,
        price: Number(product.sellingPrice),
        quantity: quantity,
      },
    ])
    setSelectedProduct("")
    setQuantity(1)
  }

  function removeFromBasket(index: number) {
    setBasket(basket.filter((_, i) => i !== index))
  }

  const total = basket.reduce((sum, item) => sum + item.price * item.quantity, 0)

  async function completeSale() {
    if (basket.length === 0) return
    setSaving(true)
    try {
      const items = basket.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }))
      await createSale(items, customerName)
      setBasket([])
      setCustomerName("")
      alert("Sale recorded successfully!")
    } catch (error) {
      alert("Could not record sale. Please try again.")
    }
    setSaving(false)
  }

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6 mb-8 animate-fade-up animation-delay-100">
      <div className="flex flex-wrap gap-3 items-end mb-6">
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Product</label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="border rounded-lg px-3 py-2 min-w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a product...</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.quantityInStock} in stock)
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Quantity</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border rounded-lg px-3 py-2 w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="button"
          onClick={addToBasket}
          className="rounded-lg bg-slate-800 px-4 py-2 text-white text-sm font-medium hover:bg-slate-900 transition-colors"
        >
          Add to Basket
        </button>
      </div>

      {basket.length > 0 ? (
        <div>
          <table className="w-full text-sm mb-4">
            <thead className="text-left text-gray-500 uppercase text-xs tracking-wide border-b border-gray-100">
              <tr>
                <th className="py-2 font-medium">Product</th>
                <th className="py-2 font-medium text-right">Price</th>
                <th className="py-2 font-medium text-right">Qty</th>
                <th className="py-2 font-medium text-right">Subtotal</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {basket.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 font-medium text-gray-900">{item.name}</td>
                  <td className="py-3 text-right text-green-600">{item.price.toLocaleString()}</td>
                  <td className="py-3 text-right text-gray-600">{item.quantity}</td>
                  <td className="py-3 text-right text-green-600">{(item.price * item.quantity).toLocaleString()}</td>
                  <td className="py-3 text-right">
                    <button
                      type="button"
                      onClick={() => removeFromBasket(index)}
                      className="text-red-600 hover:underline text-xs"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-end justify-between gap-4 pt-4 mt-2 border-t border-gray-100 bg-blue-50/50 -mx-6 -mb-6 px-6 pb-6 rounded-b-xl">
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Customer Name (optional)</label>
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Walk-in customer"
                className="border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold mb-2 text-green-600">
                Total: TZS {total.toLocaleString()}
              </div>
              <button
                type="button"
                onClick={completeSale}
                disabled={saving}
                className="rounded-lg bg-blue-600 px-6 py-2 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {saving ? "Recording..." : "Complete Sale"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-8">
          <span className="bg-blue-100 text-blue-600 rounded-full p-3 mb-3">
            <ShoppingCart size={20} />
          </span>
          <p className="text-gray-500 text-sm">Basket is empty.</p>
          <p className="text-gray-400 text-xs mt-1">Add products above to start a sale.</p>
        </div>
      )}
    </div>
  )
}