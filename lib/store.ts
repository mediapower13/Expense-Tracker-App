export interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  category: string
  description: string
  date: string
  createdAt: string
  bankAccountId?: string
  paymentMethod?: "cash" | "credit_card" | "debit_card" | "bank_transfer" | "mobile_payment" | "other"
  isAutoSync?: boolean
  bankTransactionId?: string
  merchantName?: string
  location?: string
}

export interface Category {
  id: string
  name: string
  type: "income" | "expense"
  color?: string
}

export interface BankAccount {
  id: string
  bankName: string
  accountName: string
  accountNumber: string
  accountType: "checking" | "savings" | "credit_card" | "investment"
  balance: number
  currency: string
  isActive: boolean
  lastSyncedAt?: string
  linkedAt: string
}

export interface BankSync {
  id: string
  bankAccountId: string
  status: "pending" | "syncing" | "success" | "failed"
  lastSyncTime?: string
  transactionsSynced: number
  error?: string
}
