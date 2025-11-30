export interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  category: string
  description: string
  date: string
  createdAt: string
}

export interface Category {
  id: string
  name: string
  type: "income" | "expense"
  color?: string
}
