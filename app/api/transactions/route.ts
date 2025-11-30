import { NextResponse } from "next/server"
import type { Transaction } from "@/lib/store"

// In-memory storage (replace with database in production)
let transactions: Transaction[] = [
  {
    id: "1",
    type: "income",
    amount: 5000,
    category: "Salary",
    description: "Monthly salary",
    date: "2025-11-01",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    type: "expense",
    amount: 1200,
    category: "Rent",
    description: "Monthly rent payment",
    date: "2025-11-05",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    type: "expense",
    amount: 450,
    category: "Groceries",
    description: "Weekly groceries",
    date: "2025-11-10",
    createdAt: new Date().toISOString(),
  },
]

export async function GET() {
  const summary = {
    totalIncome: transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0),
    totalExpenses: transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0),
    balance: 0,
    transactionCount: transactions.length,
  }
  summary.balance = summary.totalIncome - summary.totalExpenses

  const categoryBreakdown: Record<string, { income: number; expense: number; count: number }> = {}
  transactions.forEach((t) => {
    if (!categoryBreakdown[t.category]) {
      categoryBreakdown[t.category] = { income: 0, expense: 0, count: 0 }
    }
    if (t.type === "income") {
      categoryBreakdown[t.category].income += t.amount
    } else {
      categoryBreakdown[t.category].expense += t.amount
    }
    categoryBreakdown[t.category].count++
  })

  const monthlyData: Record<string, { income: number; expense: number }> = {}
  transactions.forEach((t) => {
    const month = new Date(t.date).toLocaleString("default", { month: "short" })
    if (!monthlyData[month]) {
      monthlyData[month] = { income: 0, expense: 0 }
    }
    if (t.type === "income") {
      monthlyData[month].income += t.amount
    } else {
      monthlyData[month].expense += t.amount
    }
  })

  return NextResponse.json({
    transactions: transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    summary,
    categoryBreakdown,
    monthlyData,
  })
}

export async function POST(request: Request) {
  const body = await request.json()
  const newTransaction: Transaction = {
    id: Date.now().toString(),
    ...body,
    createdAt: new Date().toISOString(),
  }
  transactions.push(newTransaction)
  return NextResponse.json(newTransaction, { status: 201 })
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  
  if (!id) {
    return NextResponse.json({ error: "Transaction ID required" }, { status: 400 })
  }

  transactions = transactions.filter((t) => t.id !== id)
  return NextResponse.json({ success: true })
}
