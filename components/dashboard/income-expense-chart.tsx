"use client"

import { useState, useMemo } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from "recharts"
import { TrendingUp, TrendingDown, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

interface IncomeExpenseChartProps {
  data: Array<{ date: string; income: number; expense: number }>
}

export function IncomeExpenseChart({ data }: IncomeExpenseChartProps) {
  const [chartType, setChartType] = useState<'line' | 'area'>('line')
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('30d')

  const filteredData = useMemo(() => {
    if (timeRange === 'all') return data
    const days = timeRange === '7d' ? 7 : 30
    return data.slice(-days)
  }, [data, timeRange])

  const stats = useMemo(() => {
    const totalIncome = filteredData.reduce((sum, item) => sum + item.income, 0)
    const totalExpense = filteredData.reduce((sum, item) => sum + item.expense, 0)
    const avgIncome = totalIncome / (filteredData.length || 1)
    const avgExpense = totalExpense / (filteredData.length || 1)
    const netChange = totalIncome - totalExpense
    const netChangePercent = totalExpense > 0 ? ((netChange / totalExpense) * 100) : 0

    return { totalIncome, totalExpense, avgIncome, avgExpense, netChange, netChangePercent }
  }, [filteredData])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border-2 border-border rounded-lg shadow-xl p-4">
          <p className="font-semibold text-sm mb-2 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {label}
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Income
              </span>
              <span className="font-bold text-sm text-green-600 dark:text-green-400">
                ${payload[0]?.value?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                <TrendingDown className="h-3 w-3" />
                Expense
              </span>
              <span className="font-bold text-sm text-red-600 dark:text-red-400">
                ${payload[1]?.value?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="pt-2 border-t border-border">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-muted-foreground">Net</span>
                <span className={`font-bold text-sm ${(payload[0]?.value - payload[1]?.value) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {(payload[0]?.value - payload[1]?.value) >= 0 ? '+' : '-'}
                  ${Math.abs(payload[0]?.value - payload[1]?.value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-card rounded-xl border-2 border-border p-4 sm:p-6 shadow-lg hover:shadow-2xl transition-all duration-300 group relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-success/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-card-foreground group-hover:text-primary transition-colors flex items-center gap-2">
              <span className="text-2xl">📈</span>
              Income vs Expenses
            </h3>
            <p className="text-xs text-muted-foreground mt-1">Track your financial trends over time</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex gap-1 bg-muted p-1 rounded-lg">
              {(['7d', '30d', 'all'] as const).map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                  className="h-7 text-xs px-3"
                >
                  {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : 'All'}
                </Button>
              ))}
            </div>
            <div className="flex gap-1 bg-muted p-1 rounded-lg">
              <Button
                variant={chartType === 'line' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setChartType('line')}
                className="h-7 text-xs px-3"
              >
                Line
              </Button>
              <Button
                variant={chartType === 'area' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setChartType('area')}
                className="h-7 text-xs px-3"
              >
                Area
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Total Income</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">
              ${stats.totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Total Expense</p>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">
              ${stats.totalExpense.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className={`p-3 border rounded-lg ${stats.netChange >= 0 ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'}`}>
            <p className="text-xs text-muted-foreground mb-1">Net Change</p>
            <p className={`text-lg font-bold flex items-center gap-1 ${stats.netChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {stats.netChange >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              ${Math.abs(stats.netChange).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="p-3 bg-muted border border-border rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Change %</p>
            <p className={`text-lg font-bold ${stats.netChangePercent >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {stats.netChangePercent >= 0 ? '+' : ''}{stats.netChangePercent.toFixed(1)}%
            </p>
          </div>
        </div>

        <div className="h-[250px] sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={filteredData}>
                <defs>
                  <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
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
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ 
                    color: "hsl(var(--card-foreground))", 
                    fontSize: "14px", 
                    fontWeight: "500",
                    paddingTop: "16px"
                  }}
                  iconType="circle"
                />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  name="Income" 
                  dot={{ fill: "#10b981", r: 5, strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 8, strokeWidth: 3, fill: "#10b981" }}
                  animationDuration={1000}
                />
                <Line 
                  type="monotone" 
                  dataKey="expense" 
                  stroke="#ef4444" 
                  strokeWidth={3} 
                  name="Expense" 
                  dot={{ fill: "#ef4444", r: 5, strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 8, strokeWidth: 3, fill: "#ef4444" }}
                  animationDuration={1000}
                />
              </LineChart>
            ) : (
              <AreaChart data={filteredData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
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
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ 
                    color: "hsl(var(--card-foreground))", 
                    fontSize: "14px", 
                    fontWeight: "500",
                    paddingTop: "16px"
                  }}
                  iconType="circle"
                />
                <Area 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorIncome)" 
                  name="Income"
                  animationDuration={1000}
                />
                <Area 
                  type="monotone" 
                  dataKey="expense" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorExpense)" 
                  name="Expense"
                  animationDuration={1000}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
