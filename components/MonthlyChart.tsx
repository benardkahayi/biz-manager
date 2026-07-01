"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"

type MonthRow = {
  month: string
  revenue: number
  profit: number
}

export default function MonthlyChart({ data }: { data: MonthRow[] }) {
  return (
    <div className="bg-white rounded-lg border p-6">
      <h2 className="text-lg font-semibold mb-4">Revenue & Profit by Month</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="revenue" fill="#2563eb" name="Revenue" />
          <Bar dataKey="profit" fill="#16a34a" name="Profit" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}