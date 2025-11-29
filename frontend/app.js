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
