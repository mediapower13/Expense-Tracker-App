"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface CategoryChartProps {
  data: Record<string, number>
  title: string
  type: "income" | "expense"
}

const COLORS = [
  "#10b981", // emerald-500
  "#3b82f6", // blue-500
  "#f59e0b", // amber-500
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
  "#14b8a6", // teal-500
  "#f97316", // orange-500
]

export function CategoryChart({ data, title }: CategoryChartProps) {
  const chartData = Object.entries(data).map(([name, value]) => ({
    name,
    value,
  }))

  return (
    <div className="bg-card rounded-xl border border-border p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 group">
      <h3 className="text-base sm:text-lg font-bold text-card-foreground mb-6 group-hover:text-primary transition-colors">{title}</h3>
      <div className="h-[250px] sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={window.innerWidth < 640 ? 60 : 80}
            fill="#8884d8"
            dataKey="value"
            stroke="hsl(var(--background))"
            strokeWidth={3}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
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
            labelStyle={{ fontWeight: "600" }}
          />
          <Legend 
            wrapperStyle={{ 
              color: "hsl(var(--card-foreground))", 
              fontSize: "13px",
              fontWeight: "500"
            }} 
          />
        </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
