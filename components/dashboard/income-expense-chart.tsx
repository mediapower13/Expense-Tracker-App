"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface IncomeExpenseChartProps {
  data: Array<{ date: string; income: number; expense: number }>
}

export function IncomeExpenseChart({ data }: IncomeExpenseChartProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 group">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base sm:text-lg font-bold text-card-foreground group-hover:text-primary transition-colors">Income vs Expenses</h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-success/10">
            <div className="h-2.5 w-2.5 rounded-full bg-success animate-pulse"></div>
            <span className="text-xs font-medium text-success">Income</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-destructive/10">
            <div className="h-2.5 w-2.5 rounded-full bg-destructive animate-pulse"></div>
            <span className="text-xs font-medium text-destructive">Expense</span>
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
            borderRadius: "12px",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            color: "hsl(var(--card-foreground))",
            fontSize: "14px",
            padding: "12px",
          }}
          labelStyle={{ color: "hsl(var(--card-foreground))", fontWeight: "600", marginBottom: "4px" }}
        />
        <Legend 
          wrapperStyle={{ 
            color: "hsl(var(--card-foreground))", 
            fontSize: "14px", 
            fontWeight: "500",
            paddingTop: "16px"
          }} 
        />
        <Line 
          type="monotone" 
          dataKey="income" 
          stroke="#10b981" 
          strokeWidth={3} 
          name="Income" 
          dot={{ fill: "#10b981", r: 5, strokeWidth: 2, stroke: "#fff" }}
          activeDot={{ r: 7, strokeWidth: 2 }}
        />
        <Line 
          type="monotone" 
          dataKey="expense" 
          stroke="#ef4444" 
          strokeWidth={3} 
          name="Expense" 
          dot={{ fill: "#ef4444", r: 5, strokeWidth: 2, stroke: "#fff" }}
          activeDot={{ r: 7, strokeWidth: 2 }}
        />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
