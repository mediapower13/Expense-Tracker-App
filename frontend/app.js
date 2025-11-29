import { Chart } from "@/components/ui/chart"

// CONFIGURATION & STATE

const API_BASE_URL = "http://localhost:5000/api"

const state = {
  transactions: [],
  categories: [],
  summary: {},
  categoryBreakdown: {},
  monthlyData: {},
  charts: {},
  filters: {
    search: "",
    type: "all",
    category: "all",
  },
}

// Chart.js default configuration
Chart.defaults.color = "#a0a0a8"
Chart.defaults.borderColor = "#2a2a36"
Chart.defaults.font.family = "'Inter', sans-serif"

// Lucide icon library
const lucide = {
  createIcons: () => {
    // Dummy implementation for illustration purposes
    console.log("Icons created")
  },
}

// API FUNCTIONS

async function fetchTransactions() {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions`)
    if (!response.ok) throw new Error("Failed to fetch transactions")

    const data = await response.json()
    state.transactions = data.transactions || []
    state.summary = data.summary || {}
    state.categoryBreakdown = data.categoryBreakdown || {}
    state.monthlyData = data.monthlyData || {}

    return data
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return getMockData()
  }
}

async function fetchCategories() {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`)
    if (!response.ok) throw new Error("Failed to fetch categories")

    state.categories = await response.json()
    return state.categories
  } catch (error) {
    console.error("Error fetching categories:", error)
    state.categories = getDefaultCategories()
    return state.categories
  }
}

async function addTransaction(transaction) {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transaction),
    })

    if (!response.ok) throw new Error("Failed to add transaction")

    const newTransaction = await response.json()
    state.transactions.unshift(newTransaction)
    await refreshData()
    showToast("Transaction added successfully!")
    return newTransaction
  } catch (error) {
    console.error("Error adding transaction:", error)
    const mockTransaction = {
      id: Date.now().toString(),
      ...transaction,
      created_at: new Date().toISOString(),
    }
    state.transactions.unshift(mockTransaction)
    recalculateSummary()
    renderAll()
    showToast("Transaction added!")
    return mockTransaction
  }
}

async function deleteTransaction(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) throw new Error("Failed to delete transaction")

    state.transactions = state.transactions.filter((t) => t.id !== id)
    await refreshData()
    showToast("Transaction deleted!")
  } catch (error) {
    console.error("Error deleting transaction:", error)
    state.transactions = state.transactions.filter((t) => t.id !== id)
    recalculateSummary()
    renderAll()
    showToast("Transaction deleted!")
  }
}

async function fetchReports(period = "month") {
  try {
    const response = await fetch(`${API_BASE_URL}/reports?period=${period}`)
    if (!response.ok) throw new Error("Failed to fetch reports")
    return await response.json()
  } catch (error) {
    console.error("Error fetching reports:", error)
    return calculateLocalReports(period)
  }
}

async function addCategory(category) {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    })

    if (!response.ok) throw new Error("Failed to add category")

    const newCategory = await response.json()
    state.categories.push(newCategory)
    renderCategories()
    showToast("Category added!")
    return newCategory
  } catch (error) {
    console.error("Error adding category:", error)
    const mockCategory = { id: Date.now().toString(), ...category }
    state.categories.push(mockCategory)
    renderCategories()
    showToast("Category added!")
    return mockCategory
  }
}
