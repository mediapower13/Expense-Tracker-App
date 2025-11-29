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

// DATA HELPERS

function getDefaultCategories() {
  return [
    { id: "1", name: "Salary", type: "income", color: "#10b981", icon: "wallet" },
    { id: "2", name: "Freelance", type: "income", color: "#06b6d4", icon: "laptop" },
    { id: "3", name: "Investments", type: "income", color: "#8b5cf6", icon: "trending-up" },
    { id: "4", name: "Other Income", type: "income", color: "#f59e0b", icon: "gift" },
    { id: "5", name: "Food & Dining", type: "expense", color: "#ef4444", icon: "utensils" },
    { id: "6", name: "Transportation", type: "expense", color: "#f97316", icon: "car" },
    { id: "7", name: "Shopping", type: "expense", color: "#ec4899", icon: "shopping-bag" },
    { id: "8", name: "Bills & Utilities", type: "expense", color: "#6366f1", icon: "file-text" },
    { id: "9", name: "Entertainment", type: "expense", color: "#14b8a6", icon: "film" },
    { id: "10", name: "Healthcare", type: "expense", color: "#f43f5e", icon: "heart-pulse" },
    { id: "11", name: "Education", type: "expense", color: "#3b82f6", icon: "book-open" },
    { id: "12", name: "Other Expense", type: "expense", color: "#71717a", icon: "package" },
  ]
}

function getMockData() {
  const transactions = [
    {
      id: "1",
      type: "income",
      amount: 5000,
      category: "Salary",
      description: "Monthly salary",
      date: "2025-11-01",
      created_at: "2025-11-01T09:00:00Z",
    },
    {
      id: "2",
      type: "income",
      amount: 1200,
      category: "Freelance",
      description: "Web project",
      date: "2025-11-05",
      created_at: "2025-11-05T14:30:00Z",
    },
    {
      id: "3",
      type: "expense",
      amount: 150,
      category: "Food & Dining",
      description: "Grocery shopping",
      date: "2025-11-03",
      created_at: "2025-11-03T10:15:00Z",
    },
    {
      id: "4",
      type: "expense",
      amount: 80,
      category: "Transportation",
      description: "Gas refill",
      date: "2025-11-04",
      created_at: "2025-11-04T16:00:00Z",
    },
    {
      id: "5",
      type: "expense",
      amount: 200,
      category: "Bills & Utilities",
      description: "Electricity bill",
      date: "2025-11-06",
      created_at: "2025-11-06T11:00:00Z",
    },
    {
      id: "6",
      type: "expense",
      amount: 50,
      category: "Entertainment",
      description: "Movie tickets",
      date: "2025-11-08",
      created_at: "2025-11-08T19:30:00Z",
    },
    {
      id: "7",
      type: "income",
      amount: 300,
      category: "Investments",
      description: "Dividend payout",
      date: "2025-11-10",
      created_at: "2025-11-10T08:00:00Z",
    },
    {
      id: "8",
      type: "expense",
      amount: 120,
      category: "Shopping",
      description: "New clothes",
      date: "2025-11-12",
      created_at: "2025-11-12T15:45:00Z",
    },
    {
      id: "9",
      type: "expense",
      amount: 45,
      category: "Healthcare",
      description: "Pharmacy",
      date: "2025-11-14",
      created_at: "2025-11-14T09:30:00Z",
    },
    {
      id: "10",
      type: "expense",
      amount: 250,
      category: "Education",
      description: "Online course",
      date: "2025-11-15",
      created_at: "2025-11-15T12:00:00Z",
    },
    {
      id: "11",
      type: "income",
      amount: 800,
      category: "Freelance",
      description: "Design work",
      date: "2025-11-18",
      created_at: "2025-11-18T14:00:00Z",
    },
    {
      id: "12",
      type: "expense",
      amount: 180,
      category: "Food & Dining",
      description: "Restaurant dinner",
      date: "2025-11-20",
      created_at: "2025-11-20T20:00:00Z",
    },
  ]

  state.transactions = transactions
  recalculateSummary()

  return {
    transactions,
    summary: state.summary,
    categoryBreakdown: state.categoryBreakdown,
    monthlyData: state.monthlyData,
  }
}

function recalculateSummary() {
  const totalIncome = state.transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = state.transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  state.summary = {
    total_income: totalIncome,
    total_expenses: totalExpenses,
    balance: totalIncome - totalExpenses,
    transaction_count: state.transactions.length,
    savings_rate: totalIncome > 0 ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1) : 0,
  }

  // Category breakdown
  state.categoryBreakdown = {}
  state.transactions.forEach((t) => {
    if (!state.categoryBreakdown[t.category]) {
      state.categoryBreakdown[t.category] = { income: 0, expense: 0, count: 0 }
    }
    if (t.type === "income") {
      state.categoryBreakdown[t.category].income += t.amount
    } else {
      state.categoryBreakdown[t.category].expense += t.amount
    }
    state.categoryBreakdown[t.category].count++
  })

  // Monthly data
  state.monthlyData = {}
  state.transactions.forEach((t) => {
    const month = t.date.substring(0, 7)
    if (!state.monthlyData[month]) {
      state.monthlyData[month] = { income: 0, expense: 0 }
    }
    if (t.type === "income") {
      state.monthlyData[month].income += t.amount
    } else {
      state.monthlyData[month].expense += t.amount
    }
  })
}

function calculateLocalReports(period) {
  const today = new Date()
  let startDate

  switch (period) {
    case "week":
      startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case "month":
      startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
    case "year":
      startDate = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000)
      break
    default:
      startDate = new Date("1970-01-01")
  }

  const filtered = state.transactions.filter((t) => new Date(t.date) >= startDate)

  const totalIncome = filtered.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0)
  const totalExpenses = filtered.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0)

  const categoryBreakdown = {}
  filtered.forEach((t) => {
    if (!categoryBreakdown[t.category]) {
      categoryBreakdown[t.category] = { income: 0, expense: 0, count: 0 }
    }
    categoryBreakdown[t.category][t.type] += t.amount
    categoryBreakdown[t.category].count++
  })

  const expenses = filtered.filter((t) => t.type === "expense").sort((a, b) => b.amount - a.amount)
  const income = filtered.filter((t) => t.type === "income").sort((a, b) => b.amount - a.amount)

  return {
    period,
    summary: {
      total_income: totalIncome,
      total_expenses: totalExpenses,
      balance: totalIncome - totalExpenses,
      savings_rate: totalIncome > 0 ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1) : 0,
    },
    category_breakdown: categoryBreakdown,
    top_expenses: expenses.slice(0, 5),
    top_income: income.slice(0, 5),
  }
}

async function refreshData() {
  await fetchTransactions()
  renderAll()
}

// UI RENDERING

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function getCategoryColor(categoryName) {
  const category = state.categories.find((c) => c.name === categoryName)
  return category?.color || "#71717a"
}

function getCategoryIcon(categoryName) {
  const category = state.categories.find((c) => c.name === categoryName)
  return category?.icon || "circle"
}

function renderStats() {
  document.getElementById("totalBalance").textContent = formatCurrency(state.summary.balance || 0)
  document.getElementById("totalIncome").textContent = formatCurrency(state.summary.total_income || 0)
  document.getElementById("totalExpenses").textContent = formatCurrency(state.summary.total_expenses || 0)
  document.getElementById("savingsRate").textContent = `${state.summary.savings_rate || 0}%`
}

function renderRecentTransactions() {
  const container = document.getElementById("recentTransactions")
  const recent = state.transactions.slice(0, 5)

  if (recent.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i data-lucide="inbox"></i>
        <h3>No transactions yet</h3>
        <p>Add your first transaction to get started</p>
      </div>
    `
    lucide.createIcons()
    return
  }

  container.innerHTML = recent
    .map(
      (t) => `
      <div class="transaction-item">
        <div class="transaction-icon ${t.type}">
          <i data-lucide="${t.type === "income" ? "arrow-up" : "arrow-down"}"></i>
        </div>
        <div class="transaction-details">
          <div class="transaction-description">${escapeHtml(t.description)}</div>
          <div class="transaction-category">${escapeHtml(t.category)}</div>
        </div>
        <div class="transaction-amount ${t.type}">
          ${t.type === "income" ? "+" : "-"}${formatCurrency(t.amount)}
        </div>
        <div class="transaction-date">${formatDate(t.date)}</div>
      </div>
    `,
    )
    .join("")

  lucide.createIcons()
}

function renderTransactionsTable() {
  const tbody = document.getElementById("transactionsTableBody")
  const emptyState = document.getElementById("emptyTransactions")

  let filtered = [...state.transactions]

  if (state.filters.search) {
    const search = state.filters.search.toLowerCase()
    filtered = filtered.filter(
      (t) => t.description.toLowerCase().includes(search) || t.category.toLowerCase().includes(search),
    )
  }

  if (state.filters.type !== "all") {
    filtered = filtered.filter((t) => t.type === state.filters.type)
  }

  if (state.filters.category !== "all") {
    filtered = filtered.filter((t) => t.category === state.filters.category)
  }

  if (filtered.length === 0) {
    tbody.innerHTML = ""
    emptyState.style.display = "block"
    lucide.createIcons()
    return
  }

  emptyState.style.display = "none"

  tbody.innerHTML = filtered
    .map(
      (t) => `
      <tr>
        <td>${formatDate(t.date)}</td>
        <td>${escapeHtml(t.description)}</td>
        <td>
          <span class="category-badge" style="background-color: ${getCategoryColor(t.category)}20; color: ${getCategoryColor(t.category)}">
            ${escapeHtml(t.category)}
          </span>
        </td>
        <td class="${t.type === "income" ? "income-text" : "expense-text"}">
          ${t.type === "income" ? "+" : "-"}${formatCurrency(t.amount)}
        </td>
        <td>
          <button class="action-btn delete" onclick="handleDeleteTransaction('${t.id}')" title="Delete">
            <i data-lucide="trash-2"></i>
          </button>
        </td>
      </tr>
    `,
    )
    .join("")

  lucide.createIcons()
}

function renderCategoryFilter() {
  const select = document.getElementById("categoryFilter")
  const uniqueCategories = [...new Set(state.transactions.map((t) => t.category))]

  select.innerHTML = `
    <option value="all">All Categories</option>
    ${uniqueCategories
      .map(
        (cat) => `
      <option value="${escapeHtml(cat)}">${escapeHtml(cat)}</option>
    `,
      )
      .join("")}
  `
}

function renderCategories() {
  const container = document.getElementById("categoriesList")

  container.innerHTML = state.categories
    .map(
      (c) => `
      <div class="category-item">
        <span class="category-color" style="background-color: ${c.color}"></span>
        <span class="category-name">${escapeHtml(c.name)}</span>
        <span class="category-type">${c.type}</span>
      </div>
    `,
    )
    .join("")
}

function renderCategorySelect(type = "expense") {
  const select = document.getElementById("transactionCategory")
  const filteredCategories = state.categories.filter((c) => c.type === type)

  select.innerHTML = filteredCategories
    .map(
      (c) => `
      <option value="${escapeHtml(c.name)}">${escapeHtml(c.name)}</option>
    `,
    )
    .join("")
}
