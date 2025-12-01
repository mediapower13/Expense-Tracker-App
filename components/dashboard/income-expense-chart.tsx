"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface IncomeExpenseChartProps {
  data: Array<{ date: string; income: number; expense: number }>
}

export function IncomeExpenseChart({ data }: IncomeExpenseChartProps) {
  return (
    <div className="bg-card rounded-lg border border-border p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-card-foreground mb-4">Income vs Expenses</h3>
      <ResponsiveContainer width="100%" height={250} className="sm:!h-[300px]">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis 
            dataKey="date" 
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
          <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} name="Income" dot={{ fill: "#10b981", r: 4 }} />
          <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} name="Expense" dot={{ fill: "#ef4444", r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
