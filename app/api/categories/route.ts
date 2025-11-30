import { NextResponse } from "next/server"
import type { Category } from "@/lib/store"

const categories: Category[] = [
  { id: "1", name: "Salary", type: "income" },
  { id: "2", name: "Freelance", type: "income" },
  { id: "3", name: "Investment", type: "income" },
  { id: "4", name: "Other Income", type: "income" },
  { id: "5", name: "Rent", type: "expense" },
  { id: "6", name: "Groceries", type: "expense" },
  { id: "7", name: "Utilities", type: "expense" },
  { id: "8", name: "Transportation", type: "expense" },
  { id: "9", name: "Entertainment", type: "expense" },
  { id: "10", name: "Healthcare", type: "expense" },
  { id: "11", name: "Shopping", type: "expense" },
  { id: "12", name: "Other", type: "expense" },
]

export async function GET() {
  return NextResponse.json(categories)
}
