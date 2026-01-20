"use client"

import { TrendingUp, TrendingDown, Wallet, Activity, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { useState, useEffect } from "react"

interface StatsCardsProps {
  totalIncome: number
  totalExpenses: number
  balance: number
  transactionCount: number
}

export function StatsCards({ totalIncome, totalExpenses, balance, transactionCount }: StatsCardsProps) {
  const [prevStats, setPrevStats] = useState({ totalIncome: 0, totalExpenses: 0, balance: 0, transactionCount: 0 })
  const [changes, setChanges] = useState({ income: 0, expenses: 0, balance: 0, transactions: 0 })

  useEffect(() => {
    // Calculate percentage changes
    const incomeChange = prevStats.totalIncome > 0 
      ? ((totalIncome - prevStats.totalIncome) / prevStats.totalIncome) * 100 
      : 0
    const expensesChange = prevStats.totalExpenses > 0 
      ? ((totalExpenses - prevStats.totalExpenses) / prevStats.totalExpenses) * 100 
      : 0
    const balanceChange = prevStats.balance > 0 
      ? ((balance - prevStats.balance) / prevStats.balance) * 100 
      : 0
    const transactionsChange = prevStats.transactionCount > 0 
      ? ((transactionCount - prevStats.transactionCount) / prevStats.transactionCount) * 100 
      : 0

    setChanges({
      income: incomeChange,
      expenses: expensesChange,
      balance: balanceChange,
      transactions: transactionsChange
    })

    // Update previous stats for next comparison
    setPrevStats({ totalIncome, totalExpenses, balance, transactionCount })
  }, [totalIncome, totalExpenses, balance, transactionCount])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatChange = (change: number) => {
    if (change === 0) return null
    const formatted = Math.abs(change).toFixed(1)
    return (
      <span className={`flex items-center gap-1 text-xs font-semibold ${change > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
        {change > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
        {formatted}%
      </span>
    )
  }

  const stats = [
    {
      title: "Total Income",
      value: formatCurrency(totalIncome),
      icon: TrendingUp,
      color: "text-success",
      bgColor: "bg-success/10",
      change: changes.income,
      gradient: "from-green-500/20 to-emerald-500/20"
    },
    {
      title: "Total Expenses",
      value: formatCurrency(totalExpenses),
      icon: TrendingDown,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      change: changes.expenses,
      gradient: "from-red-500/20 to-rose-500/20"
    },
    {
      title: "Balance",
      value: formatCurrency(balance),
      icon: Wallet,
      color: "text-primary",
      bgColor: "bg-primary/10",
      change: changes.balance,
      gradient: "from-blue-500/20 to-indigo-500/20"
    },
    {
      title: "Transactions",
      value: transactionCount.toString(),
      icon: Activity,
      color: "text-accent",
      bgColor: "bg-accent/10",
      change: changes.transactions,
      gradient: "from-purple-500/20 to-pink-500/20"
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div 
            key={stat.title} 
            className="group bg-card rounded-xl border-2 border-border p-4 sm:p-6 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer relative overflow-hidden"
          >
            {/* Animated background decoration */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            <div className="flex items-start justify-between relative z-10">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-xs sm:text-sm font-semibold text-muted-foreground truncate uppercase tracking-wider">
                    {stat.title}
                  </p>
                  {formatChange(stat.change)}
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-card-foreground mt-1 sm:mt-2 truncate">
                  {stat.value}
                </p>
                <div className="mt-3 h-1 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${stat.bgColor} transition-all duration-500 group-hover:w-full`}
                    style={{ width: '60%' }}
                  />
                </div>
              </div>
              <div className={`${stat.bgColor} p-3 sm:p-4 rounded-xl ml-3 shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                <Icon className={`h-5 w-5 sm:h-7 sm:w-7 ${stat.color}`} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
