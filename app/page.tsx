"use client"

import { useState, useEffect, useCallback } from "react"
import useSWR, { mutate } from "swr"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/dashboard/sidebar"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { IncomeExpenseChart } from "@/components/dashboard/income-expense-chart"
import { CategoryChart } from "@/components/dashboard/category-chart"
import { MonthlyBarChart } from "@/components/dashboard/monthly-bar-chart"
import { TransactionForm } from "@/components/dashboard/transaction-form"
import { TransactionsList } from "@/components/dashboard/transactions-list"
import { ReportsView } from "@/components/dashboard/reports-view"
import { SettingsView } from "@/components/dashboard/settings-view"
import type { Transaction, Category } from "@/lib/store"

interface TransactionsData {
  transactions: Transaction[]
  summary: {
    totalIncome: number
    totalExpenses: number
    balance: number
    transactionCount: number
  }
  categoryBreakdown: Record<string, { income: number; expense: number; count: number }>
  monthlyData: Record<string, { income: number; expense: number }>
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function ExpenseTrackerApp() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [showForm, setShowForm] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  // Fetch transactions data
  const { data, error, isLoading } = useSWR<TransactionsData>("/api/transactions", fetcher, {
    refreshInterval: 0,
  })

  // Fetch categories
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories)
      .catch(console.error)
  }, [])

  // Handle adding a transaction
  const handleAddTransaction = useCallback(
    async (transaction: {
      type: "income" | "expense"
      amount: number
      category: string
      description: string
      date: string
    }) => {
      try {
        await fetch("/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(transaction),
        })
        mutate("/api/transactions")
      } catch (error) {
        console.error("Failed to add transaction:", error)
      }
    },
    [],
  )

  // Handle deleting a transaction
  const handleDeleteTransaction = useCallback(async (id: string) => {
    try {
      await fetch(`/api/transactions?id=${id}`, { method: "DELETE" })
      mutate("/api/transactions")
    } catch (error) {
      console.error("Failed to delete transaction:", error)
    }
  }, [])

  // Prepare chart data
  const dailyTrendData = data?.transactions
    ? data.transactions
        .reduce(
          (acc: Array<{ date: string; income: number; expense: number }>, t: Transaction) => {
            const existing = acc.find((d) => d.date === t.date)
            if (existing) {
              if (t.type === "income") existing.income += t.amount
              else existing.expense += t.amount
            } else {
              acc.push({
                date: t.date,
                income: t.type === "income" ? t.amount : 0,
                expense: t.type === "expense" ? t.amount : 0,
              })
            }
            return acc
          },
          [] as Array<{ date: string; income: number; expense: number }>,
        )
        .sort((a: { date: string }, b: { date: string }) => a.date.localeCompare(b.date))
    : []

  const expenseByCategory = data?.transactions
    ? data.transactions
        .filter((t: Transaction) => t.type === "expense")
        .reduce(
          (acc: Record<string, number>, t: Transaction) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount
            return acc
          },
          {} as Record<string, number>,
        )
    : {}

  const incomeByCategory = data?.transactions
    ? data.transactions
        .filter((t: Transaction) => t.type === "income")
        .reduce(
          (acc: Record<string, number>, t: Transaction) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount
            return acc
          },
          {} as Record<string, number>,
        )
    : {}

  const renderContent = () => {
    if (activeTab === "reports") {
      return <ReportsView />
    }

    if (activeTab === "settings") {
      return <SettingsView />
    }

    if (activeTab === "transactions") {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">All Transactions</h2>
              <p className="text-muted-foreground">View and manage your transactions</p>
            </div>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </div>
          <TransactionsList transactions={data?.transactions || []} onDelete={handleDeleteTransaction} />
        </div>
      )
    }

    // Dashboard view
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Track your income and expenses</p>
          </div>
          <Button onClick={() => setShowForm(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </div>

        {/* Stats Cards */}
        <StatsCards
          totalIncome={data?.summary.totalIncome || 0}
          totalExpenses={data?.summary.totalExpenses || 0}
          balance={data?.summary.balance || 0}
          transactionCount={data?.summary.transactionCount || 0}
        />

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IncomeExpenseChart data={dailyTrendData} />
          <MonthlyBarChart data={data?.monthlyData || {}} />
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.keys(expenseByCategory).length > 0 && (
            <CategoryChart data={expenseByCategory} title="Expense by Category" type="expense" />
          )}
          {Object.keys(incomeByCategory).length > 0 && (
            <CategoryChart data={incomeByCategory} title="Income by Source" type="income" />
          )}
        </div>

        {/* Recent Transactions */}
        <TransactionsList transactions={(data?.transactions || []).slice(0, 10)} onDelete={handleDeleteTransaction} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-destructive">Failed to load data. Please try again.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            renderContent()
          )}
        </div>
      </main>

      {/* Transaction Form Modal */}
      {showForm && (
        <TransactionForm
          categories={categories}
          onSubmit={handleAddTransaction}
          onClose={() => setShowForm(false)}
          isModal
        />
      )}
    </div>
  )
}
