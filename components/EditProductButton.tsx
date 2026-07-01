"use client"
import { useState } from "react"
import { updateProduct } from "@/services/products"
import type { Product } from "@prisma/client"

export default function EditProductButton({ product }: { product: Product }) {
  const [open, setOpen] = useState(false)

  async function handleSave(formData: FormData) {
    await updateProduct(formData)
    setOpen(false)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-blue-600 hover:underline text-sm"
      >
        Edit
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-sm p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Edit Product</h2>

            <form action={handleSave} className="flex flex-col gap-3">
              <input type="hidden" name="id" value={product.id} />

              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Name</label>
                <input name="name" defaultValue={product.name} required className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">SKU</label>
                <input name="sku" defaultValue={product.sku || ""} className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Selling Price (TZS)</label>
                <input name="sellingPrice" type="number" defaultValue={product.sellingPrice.toString()} className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Reorder Level</label>
                <input name="reorderLevel" type="number" defaultValue={product.reorderLevel} className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div className="flex gap-2 justify-end mt-2">
                <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
