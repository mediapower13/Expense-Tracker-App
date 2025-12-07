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
    <div className="bg-card rounded-xl border border-border p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 group">
      <h3 className="text-base sm:text-lg font-bold text-card-foreground mb-6 group-hover:text-primary transition-colors">Monthly Overview</h3>
      <div className="h-[250px] sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barGap={8}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis 
            dataKey="month" 
            stroke="hsl(var(--muted-foreground))" 
            fontSize={12}
            className="sm:text-sm"
            tick={{ fill: "hsl(var(--muted-foreground))" }}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))" 
            fontSize={12}
            className="sm:text-sm"
            tick={{ fill: "hsl(var(--muted-foreground))" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "12px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              color: "hsl(var(--card-foreground))",
              fontSize: "14px",
              padding: "12px",
            }}
            labelStyle={{ color: "hsl(var(--card-foreground))", fontWeight: "600", marginBottom: "4px" }}
            cursor={{ fill: "hsl(var(--accent))", opacity: 0.1 }}
          />
          <Legend 
            wrapperStyle={{ 
              color: "hsl(var(--card-foreground))", 
              fontSize: "14px",
              fontWeight: "500",
              paddingTop: "16px"
            }} 
          />
          <Bar dataKey="income" fill="#10b981" name="Income" radius={[6, 6, 0, 0]} />
          <Bar dataKey="expense" fill="#ef4444" name="Expense" radius={[6, 6, 0, 0]} />
        </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
