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
    <div className="bg-card rounded-lg border border-border p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-card-foreground mb-4">Monthly Overview</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis 
            dataKey="month" 
            stroke="hsl(var(--muted-foreground))" 
            fontSize={12}
            className="sm:text-sm"
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))" 
            fontSize={12}
            className="sm:text-sm"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              color: "hsl(var(--card-foreground))",
              fontSize: "14px",
            }}
            labelStyle={{ color: "hsl(var(--card-foreground))" }}
          />
          <Legend wrapperStyle={{ color: "hsl(var(--card-foreground))", fontSize: "14px" }} />
          <Bar dataKey="income" fill="#10b981" name="Income" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expense" fill="#ef4444" name="Expense" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
