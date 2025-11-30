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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div key={stat.title} className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold text-card-foreground mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
