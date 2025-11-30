"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface MonthlyBarChartProps {
  data: Record<string, { income: number; expense: number }>
}

export function MonthlyBarChart({ data }: MonthlyBarChartProps) {
  const chartData = Object.entries(data).map(([month, values]) => ({
    month,
    ...values,
  }))

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h3 className="text-lg font-semibold text-card-foreground mb-4">Monthly Overview</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
          <YAxis stroke="hsl(var(--muted-foreground))" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Legend />
          <Bar dataKey="income" fill="hsl(var(--success))" />
          <Bar dataKey="expense" fill="hsl(var(--destructive))" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
