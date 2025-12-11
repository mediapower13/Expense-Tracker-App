import { NextResponse } from "next/server"
import type { BankAccount, BankSync } from "@/lib/store"

// In-memory storage (replace with database in production)
let bankAccounts: BankAccount[] = []
let syncHistory: BankSync[] = []

export async function GET() {
  return NextResponse.json({
    accounts: bankAccounts.sort((a, b) => 
      new Date(b.linkedAt).getTime() - new Date(a.linkedAt).getTime()
    ),
  })
}

export async function POST(request: Request) {
  const body = await request.json()
  
  const newAccount: BankAccount = {
    id: Date.now().toString(),
    bankName: body.bankName,
    accountName: body.accountName,
    accountNumber: body.accountNumber,
    accountType: body.accountType,
    balance: body.balance || 0,
    currency: body.currency || "USD",
    isActive: body.isActive !== false,
    linkedAt: new Date().toISOString(),
  }

  bankAccounts.push(newAccount)
  return NextResponse.json(newAccount, { status: 201 })
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  
  if (!id) {
    return NextResponse.json({ error: "Account ID required" }, { status: 400 })
  }

  bankAccounts = bankAccounts.filter((a) => a.id !== id)
  return NextResponse.json({ success: true })
}

export async function PATCH(request: Request) {
  const body = await request.json()
  const { id, ...updates } = body
  
  if (!id) {
    return NextResponse.json({ error: "Account ID required" }, { status: 400 })
  }

  const accountIndex = bankAccounts.findIndex((a) => a.id === id)
  
  if (accountIndex === -1) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 })
  }

  bankAccounts[accountIndex] = {
    ...bankAccounts[accountIndex],
    ...updates,
  }

  return NextResponse.json(bankAccounts[accountIndex])
}

// Export sync history for other routes
export { syncHistory }
