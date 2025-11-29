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
