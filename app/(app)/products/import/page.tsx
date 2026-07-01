"use client"

import { useState } from "react"
import * as XLSX from "xlsx"
import { bulkCreateProducts } from "@/services/products"
import { FileSpreadsheet, CheckCircle2 } from "lucide-react"

type ProductRow = {
  Name: string
  SKU?: string
  "Selling Price"?: number
  "Reorder Level"?: number
}

export default function ImportPage() {
  const [rows, setRows] = useState<ProductRow[]>([])
  const [importing, setImporting] = useState(false)
  const [done, setDone] = useState(false)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (evt) => {
      const data = evt.target?.result
      const workbook = XLSX.read(data, { type: "array" })
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const parsed = XLSX.utils.sheet_to_json<ProductRow>(sheet)
      setRows(parsed)
      setDone(false)
    }
    reader.readAsArrayBuffer(file)
  }

  async function handleImport() {
    setImporting(true)
    await bulkCreateProducts(rows)
    setImporting(false)
    setDone(true)
    setRows([])
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6 animate-fade-up">
        <span className="bg-blue-100 text-blue-600 rounded-lg p-2.5">
          <FileSpreadsheet size={20} />
        </span>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Import Products</h1>
          <p className="text-sm text-gray-500">Bulk-add products from an Excel file</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-6 mb-6 animate-fade-up animation-delay-100">
        <p className="text-sm text-gray-600 mb-4">
          Upload an Excel file (.xlsx) with columns: <strong>Name</strong>, SKU, Selling Price, Reorder Level.
        </p>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFile}
          className="text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-blue-600 file:font-medium hover:file:bg-blue-100 file:cursor-pointer cursor-pointer"
        />
      </div>

      {done && (
        <p className="mb-4 flex items-center gap-2 text-green-700 text-sm font-medium bg-green-50 border border-green-200 rounded-lg px-3 py-2 animate-fade-up">
          <CheckCircle2 size={16} />
          Import complete! Products have been added.
        </p>
      )}

      {rows.length > 0 && (
        <>
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden mb-4 animate-fade-up animation-delay-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-500 uppercase text-xs tracking-wide">
                <tr>
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">SKU</th>
                  <th className="p-4 font-medium text-right">Selling Price (TZS)</th>
                  <th className="p-4 font-medium text-right">Reorder Level</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">{r.Name}</td>
                    <td className="p-4 text-gray-600">{r.SKU || "—"}</td>
                    <td className="p-4 text-right text-green-600">{r["Selling Price"] ?? "—"}</td>
                    <td className="p-4 text-right text-gray-600">{r["Reorder Level"] ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={handleImport}
            disabled={importing}
            className="rounded-lg bg-blue-600 px-6 py-2 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {importing ? "Importing..." : `Import ${rows.length} Products`}
          </button>
        </>
      )}
    </div>
  )
}
