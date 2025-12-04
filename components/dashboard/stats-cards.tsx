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
          <div 
            key={stat.title} 
            className="group bg-card rounded-xl border border-border p-4 sm:p-6 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer relative overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute inset-0 bg-linear-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="flex items-center justify-between relative z-10">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-muted-foreground truncate uppercase tracking-wider">{stat.title}</p>
                <p className="text-xl sm:text-3xl font-bold text-card-foreground mt-2 sm:mt-3 truncate">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} p-3 sm:p-4 rounded-xl ml-2 shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`h-5 w-5 sm:h-7 sm:w-7 ${stat.color}`} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
