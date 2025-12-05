"use client"

import { Trash2, TrendingUp, TrendingDown } from "lucide-react"
import type { Transaction } from "@/lib/store"
import { Button } from "@/components/ui/button"

interface TransactionsListProps {
  transactions: Transaction[]
  onDelete: (id: string) => void
}

export function TransactionsList({ transactions, onDelete }: TransactionsListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-6 sm:p-8 text-center">
        <p className="text-sm sm:text-base text-muted-foreground">No transactions yet. Add your first transaction to get started!</p>
      </div>
    )
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block bg-card rounded-xl border border-border overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-linear-to-r from-muted to-muted/50">
              <tr>
                <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Description
                </th>
                <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 lg:px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 lg:px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-muted/50 transition-colors group">
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-card-foreground">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 lg:px-6 py-4 text-sm text-card-foreground font-medium">{transaction.description}</td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-1.5">
                      {transaction.type === "income" ? (
                        <>
                          <div className="p-1 rounded-full bg-success/10">
                            <TrendingUp className="h-4 w-4 text-success" />
                          </div>
                          <span className="text-success font-medium">Income</span>
                        </>
                      ) : (
                        <>
                          <div className="p-1 rounded-full bg-destructive/10">
                            <TrendingDown className="h-4 w-4 text-destructive" />
                          </div>
                          <span className="text-destructive font-medium">Expense</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td
                    className={`px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-right font-bold ${
                      transaction.type === "income" ? "text-success" : "text-destructive"
                    }`}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </td>
                <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-right text-sm">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(transaction.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                    aria-label="Delete transaction"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="bg-card rounded-xl border border-border p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-card-foreground truncate">{transaction.description}</p>
                <p className="text-xs text-muted-foreground mt-1.5">
                  {new Date(transaction.date).toLocaleDateString()}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(transaction.id)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0 rounded-lg group-hover:scale-110 transition-transform"
                aria-label="Delete transaction"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-border/50">
              <div className="flex items-center gap-2.5">
                {transaction.type === "income" ? (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10">
                    <div className="p-0.5 rounded-full bg-success/20">
                      <TrendingUp className="h-3.5 w-3.5 text-success" />
                    </div>
                    <span className="text-xs font-semibold text-success">Income</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-destructive/10">
                    <div className="p-0.5 rounded-full bg-destructive/20">
                      <TrendingDown className="h-3.5 w-3.5 text-destructive" />
                    </div>
                    <span className="text-xs font-semibold text-destructive">Expense</span>
                  </div>
                )}
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {transaction.category}
                </span>
              </div>
              <p
                className={`text-base font-bold ${
                  transaction.type === "income" ? "text-success" : "text-destructive"
                }`}
              >
                {transaction.type === "income" ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
