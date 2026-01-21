"use client"

import { useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Sector } from "recharts"

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
  "#06b6d4", // cyan-500
  "#84cc16", // lime-500
]

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props

  return (
    <g>
      <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill={fill} className="font-bold text-base">
        {payload.name}
      </text>
      <text x={cx} y={cy + 10} dy={8} textAnchor="middle" fill="#666" className="text-sm">
        ${value.toLocaleString()}
      </text>
      <text x={cx} y={cy + 30} dy={8} textAnchor="middle" fill="#999" className="text-xs">
        {(percent * 100).toFixed(1)}%
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  )
}

export function CategoryChart({ data, title, type }: CategoryChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined)
  
  const chartData = Object.entries(data).map(([name, value]) => ({
    name,
    value,
  }))

  const total = chartData.reduce((sum, item) => sum + item.value, 0)

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }

  const onPieLeave = () => {
    setActiveIndex(undefined)
  }

  return (
    <div className="bg-card rounded-xl border-2 border-border p-4 sm:p-6 shadow-lg hover:shadow-2xl transition-all duration-300 group relative overflow-hidden">
      {/* Animated background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${type === 'expense' ? 'from-red-500/5 via-transparent to-orange-500/5' : 'from-green-500/5 via-transparent to-emerald-500/5'} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base sm:text-lg font-bold text-card-foreground group-hover:text-primary transition-colors flex items-center gap-2">
            <span className="text-2xl">{type === 'expense' ? '📊' : '💰'}</span>
            {title}
          </h3>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className={`text-lg font-bold ${type === 'expense' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
              ${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>
        
        {chartData.length > 0 ? (
          <>
            <div className="h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => activeIndex === undefined ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
                    outerRadius={window.innerWidth < 640 ? 60 : 80}
                    fill="#8884d8"
                    dataKey="value"
                    stroke="hsl(var(--background))"
                    strokeWidth={3}
                    onMouseEnter={onPieEnter}
                    onMouseLeave={onPieLeave}
                    animationBegin={0}
                    animationDuration={800}
                  >
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]}
                        className="hover:opacity-80 transition-opacity cursor-pointer"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "2px solid hsl(var(--border))",
                      borderRadius: "12px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      color: "hsl(var(--card-foreground))",
                      fontSize: "14px",
                      padding: "12px",
                    }}
                    labelStyle={{ fontWeight: "600", marginBottom: "4px" }}
                    formatter={(value: number) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  />
                  <Legend 
                    wrapperStyle={{ 
                      color: "hsl(var(--card-foreground))", 
                      fontSize: "13px",
                      fontWeight: "500"
                    }}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Category breakdown */}
            <div className="mt-4 pt-4 border-t-2 border-border space-y-2">
              {chartData.map((item, index) => {
                const percentage = (item.value / total * 100).toFixed(1)
                return (
                  <div 
                    key={item.name}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(undefined)}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">{percentage}%</span>
                      <span className="text-sm font-semibold">
                        ${item.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        ) : (
          <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground">
            <div className="text-6xl mb-4">{type === 'expense' ? '📊' : '💰'}</div>
            <p className="text-sm">No {type} data available</p>
          </div>
        )}
      </div>
    </div>
  )
}
