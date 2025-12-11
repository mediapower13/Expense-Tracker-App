import { NextResponse } from "next/server"
import type { BankSync, Transaction } from "@/lib/store"

// In-memory storage
let syncHistory: BankSync[] = []
let transactions: Transaction[] = []

// Simulated bank transaction data
const generateMockBankTransactions = (accountId: string) => {
  const mockTransactions = [
    {
      amount: 150.00,
      description: "Grocery Shopping",
      merchantName: "Whole Foods Market",
      category: "Groceries",
      type: "expense" as const,
      location: "San Francisco, CA",
    },
    {
      amount: 45.50,
      description: "Gas Station",
      merchantName: "Shell",
      category: "Transportation",
      type: "expense" as const,
      location: "Oakland, CA",
    },
    {
      amount: 3500.00,
      description: "Salary Deposit",
      merchantName: "Company Inc",
      category: "Salary",
      type: "income" as const,
      location: "Direct Deposit",
    },
    {
      amount: 89.99,
      description: "Online Shopping",
      merchantName: "Amazon",
      category: "Shopping",
      type: "expense" as const,
      location: "Online",
    },
    {
      amount: 25.00,
      description: "Coffee Shop",
      merchantName: "Starbucks",
      category: "Food & Dining",
      type: "expense" as const,
      location: "Berkeley, CA",
    },
  ]

  return mockTransactions.map((tx) => ({
    ...tx,
    id: `bank_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    bankAccountId: accountId,
    paymentMethod: tx.type === "income" ? "bank_transfer" as const : "debit_card" as const,
    isAutoSync: true,
    bankTransactionId: `BTX${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    createdAt: new Date().toISOString(),
  }))
}

export async function POST(request: Request) {
  const body = await request.json()
  const { accountId } = body

  if (!accountId) {
    return NextResponse.json({ error: "Account ID required" }, { status: 400 })
  }

  // Create sync record
  const sync: BankSync = {
    id: Date.now().toString(),
    bankAccountId: accountId,
    status: "syncing",
    transactionsSynced: 0,
    lastSyncTime: new Date().toISOString(),
  }

  syncHistory.push(sync)

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  try {
    // Generate mock transactions
    const newTransactions = generateMockBankTransactions(accountId)
    transactions.push(...newTransactions)

    // Update sync record
    const syncIndex = syncHistory.findIndex((s) => s.id === sync.id)
    if (syncIndex !== -1) {
      syncHistory[syncIndex] = {
        ...sync,
        status: "success",
        transactionsSynced: newTransactions.length,
        lastSyncTime: new Date().toISOString(),
      }
    }

    // Update bank account's lastSyncedAt
    const accountResponse = await fetch(
      `${request.headers.get("origin")}/api/banks`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: accountId,
          lastSyncedAt: new Date().toISOString(),
        }),
      }
    )

    return NextResponse.json({
      success: true,
      transactionsSynced: newTransactions.length,
      transactions: newTransactions,
    })
  } catch (error) {
    // Update sync record with error
    const syncIndex = syncHistory.findIndex((s) => s.id === sync.id)
    if (syncIndex !== -1) {
      syncHistory[syncIndex] = {
        ...sync,
        status: "failed",
        error: error instanceof Error ? error.message : "Unknown error",
        lastSyncTime: new Date().toISOString(),
      }
    }

    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Sync failed" 
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    history: syncHistory.sort((a, b) => 
      new Date(b.lastSyncTime || 0).getTime() - new Date(a.lastSyncTime || 0).getTime()
    ),
  })
}
