"use client"

import { useState } from "react"
import { FileText, Download, Calendar, TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ReportsView() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  const periods = [
    { id: "week", label: "Last Week" },
    { id: "month", label: "This Month" },
    { id: "quarter", label: "This Quarter" },
    { id: "year", label: "This Year" },
  ]

  const reportSummary = {
    totalIncome: 15420.50,
    totalExpenses: 8750.25,
    netSavings: 6670.25,
    transactionCount: 156,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-linear-to-br from-card via-card to-card/95 rounded-2xl border border-border p-6 sm:p-8 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Financial Reports</h2>
            <p className="text-sm sm:text-base text-muted-foreground">Detailed analytics and financial insights</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Period Selector */}
      <div className="flex flex-wrap gap-2">
        {periods.map((period) => (
          <button
            key={period.id}
            onClick={() => setSelectedPeriod(period.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedPeriod === period.id
                ? "bg-primary text-primary-foreground shadow-lg"
                : "bg-card text-card-foreground border border-border hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            <Calendar className="h-4 w-4 inline mr-2" />
            {period.label}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-success/10 rounded-lg">
              <TrendingUp className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase">Total Income</p>
              <p className="text-2xl font-bold text-foreground">${reportSummary.totalIncome.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-destructive/10 rounded-lg">
              <TrendingDown className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase">Total Expenses</p>
              <p className="text-2xl font-bold text-foreground">${reportSummary.totalExpenses.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-primary/10 rounded-lg">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase">Net Savings</p>
              <p className="text-2xl font-bold text-foreground">${reportSummary.netSavings.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-accent/10 rounded-lg">
              <FileText className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase">Transactions</p>
              <p className="text-2xl font-bold text-foreground">{reportSummary.transactionCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Report Details */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-lg">
        <h3 className="text-lg font-bold text-foreground mb-4">Report Details</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-muted-foreground">Savings Rate</span>
            <span className="text-foreground font-semibold">
              {((reportSummary.netSavings / reportSummary.totalIncome) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-muted-foreground">Average Transaction</span>
            <span className="text-foreground font-semibold">
              ${((reportSummary.totalIncome + reportSummary.totalExpenses) / reportSummary.transactionCount).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="text-muted-foreground">Period</span>
            <span className="text-foreground font-semibold capitalize">{selectedPeriod}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
