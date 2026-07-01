"use client"

import dynamic from "next/dynamic"

const MonthlyChart = dynamic(() => import("./MonthlyChart"), {
  ssr: false,
  loading: () => <div className="bg-white rounded-lg border p-6 text-gray-500 text-sm">Loading chart…</div>,
})

type MonthRow = {
  month: string
  revenue: number
  profit: number
}

export default function MonthlyChartWrapper({ data }: { data: MonthRow[] }) {
  return <MonthlyChart data={data} />
}