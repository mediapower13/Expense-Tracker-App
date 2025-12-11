export const SUPPORTED_BANKS = [
  { id: "chase", name: "Chase Bank", logo: "🏦" },
  { id: "bofa", name: "Bank of America", logo: "🏦" },
  { id: "wells_fargo", name: "Wells Fargo", logo: "🏦" },
  { id: "citi", name: "Citibank", logo: "🏦" },
  { id: "capital_one", name: "Capital One", logo: "🏦" },
  { id: "usbank", name: "US Bank", logo: "🏦" },
  { id: "pnc", name: "PNC Bank", logo: "🏦" },
  { id: "td", name: "TD Bank", logo: "🏦" },
  { id: "truist", name: "Truist Bank", logo: "🏦" },
  { id: "other", name: "Other Bank", logo: "🏦" },
] as const

export const PAYMENT_METHODS = [
  { value: "cash", label: "Cash", icon: "💵" },
  { value: "credit_card", label: "Credit Card", icon: "💳" },
  { value: "debit_card", label: "Debit Card", icon: "💳" },
  { value: "bank_transfer", label: "Bank Transfer", icon: "🏦" },
  { value: "mobile_payment", label: "Mobile Payment", icon: "📱" },
  { value: "other", label: "Other", icon: "💰" },
] as const

export interface BankConnectionConfig {
  bankId: string
  accountNumber: string
  routingNumber?: string
  apiKey?: string
  accessToken?: string
}

export interface SyncResult {
  success: boolean
  transactionsAdded: number
  transactionsUpdated: number
  errors: string[]
  lastSyncTime: string
}

export interface BankTransactionRaw {
  id: string
  amount: number
  description: string
  date: string
  merchantName?: string
  category?: string
  type: "debit" | "credit"
  status: "pending" | "completed"
  location?: string
}
