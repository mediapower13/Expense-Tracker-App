"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface IncomeExpenseChartProps {
  data: Array<{ date: string; income: number; expense: number }>
}

export function IncomeExpenseChart({ data }: IncomeExpenseChartProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-lg font-bold text-card-foreground">Income vs Expenses</h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-success"></div>
            <span className="text-xs text-muted-foreground">Income</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-destructive"></div>
            <span className="text-xs text-muted-foreground">Expense</span>
          </div>
        </div>
      </div>
      <div className="h-[250px] sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
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
    </div>
  )
}
