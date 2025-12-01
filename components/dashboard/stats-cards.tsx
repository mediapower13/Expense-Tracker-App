"use client"

import { TrendingUp, TrendingDown, Wallet, Activity } from "lucide-react"

interface StatsCardsProps {
  totalIncome: number
  totalExpenses: number
  balance: number
  transactionCount: number
}

export function StatsCards({ totalIncome, totalExpenses, balance, transactionCount }: StatsCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const stats = [
    {
      title: "Total Income",
      value: formatCurrency(totalIncome),
      icon: TrendingUp,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Total Expenses",
      value: formatCurrency(totalExpenses),
      icon: TrendingDown,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      title: "Balance",
      value: formatCurrency(balance),
      icon: Wallet,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Transactions",
      value: transactionCount.toString(),
      icon: Activity,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div key={stat.title} className="bg-card rounded-lg border border-border p-4 sm:p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{stat.title}</p>
                <p className="text-xl sm:text-2xl font-bold text-card-foreground mt-1 sm:mt-2 truncate">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} p-2 sm:p-3 rounded-lg ml-2 shrink-0`}>
                <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
