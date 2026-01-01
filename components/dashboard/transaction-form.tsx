"use client"

import { useState, useEffect } from "react"
import { X, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PAYMENT_METHODS } from "@/lib/bank-types"
import type { Category, BankAccount } from "@/lib/store"

interface TransactionFormProps {
  categories: Category[]
  onSubmit: (transaction: {
    type: "income" | "expense"
    amount: number
    category: string
    description: string
    date: string
    bankAccountId?: string
    paymentMethod?: string
    merchantName?: string
    location?: string
  }) => void
  onClose: () => void
  isModal?: boolean
}

export function TransactionForm({ categories, onSubmit, onClose, isModal = false }: TransactionFormProps) {
  const [type, setType] = useState<"income" | "expense">("expense")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [bankAccountId, setBankAccountId] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [merchantName, setMerchantName] = useState("")
  const [location, setLocation] = useState("")
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([])

  useEffect(() => {
    loadBankAccounts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadBankAccounts = async () => {
    try {
      const response = await fetch("/api/banks")
      const data = await response.json()
      setBankAccounts(data.accounts || [])
    } catch (error) {
      console.error("Failed to load bank accounts:", error)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      type,
      amount: parseFloat(amount),
      category: category || (type === "expense" ? "Other" : "Other Income"),
      description,
      date,
      bankAccountId: bankAccountId || undefined,
      paymentMethod: paymentMethod || undefined,
      merchantName: merchantName || undefined,
      location: location || undefined,
    })
    onClose()
  }

  const filteredCategories = categories.filter((cat) => cat.type === type)

  return (
    <div className={isModal ? "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200" : ""}>
      <div className="bg-card rounded-xl border border-border shadow-2xl p-4 sm:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-card-foreground">Add New Transaction</h2>
          {isModal && (
            <button 
              onClick={onClose} 
              aria-label="Close" 
              title="Close" 
              className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg p-2 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">Type</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setType("expense")}
                className={`flex-1 py-2 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                  type === "expense"
                    ? "bg-destructive text-destructive-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setType("income")}
                className={`flex-1 py-2 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                  type === "income"
                    ? "bg-success text-success-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                Income
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="amount" className="block text-xs sm:text-sm font-medium text-foreground mb-2">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">$</span>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.01"
                required
                className="w-full pl-8 pr-3 py-2 text-sm sm:text-base bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label htmlFor="category" className="block text-xs sm:text-sm font-medium text-foreground mb-2">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-sm sm:text-base bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            >
              <option value="">Select category</option>
              {filteredCategories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-xs sm:text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm sm:text-base bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              placeholder="Enter description"
            />
          </div>

          <div>
            <label htmlFor="date" className="block text-xs sm:text-sm font-medium text-foreground mb-2">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm sm:text-base bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
          </div>

          <div className="border-t border-border pt-4">
            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Payment Details (Optional)
            </h4>
            
            <div className="space-y-3">
              <div>
                <label htmlFor="bankAccount" className="block text-xs sm:text-sm font-medium text-foreground mb-2">
                  Bank Account
                </label>
                <select
                  id="bankAccount"
                  value={bankAccountId}
                  onChange={(e) => setBankAccountId(e.target.value)}
                  className="w-full px-3 py-2 text-sm sm:text-base bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                >
                  <option value="">None (Cash)</option>
                  {bankAccounts.filter((a) => a.isActive).map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.accountName} - {account.bankName} (****{account.accountNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="paymentMethod" className="block text-xs sm:text-sm font-medium text-foreground mb-2">
                  Payment Method
                </label>
                <select
                  id="paymentMethod"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 text-sm sm:text-base bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                >
                  <option value="">Select method</option>
                  {PAYMENT_METHODS.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.icon} {method.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="merchantName" className="block text-xs sm:text-sm font-medium text-foreground mb-2">
                  Merchant Name
                </label>
                <input
                  type="text"
                  id="merchantName"
                  value={merchantName}
                  onChange={(e) => setMerchantName(e.target.value)}
                  className="w-full px-3 py-2 text-sm sm:text-base bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  placeholder="e.g., Walmart, Amazon"
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-xs sm:text-sm font-medium text-foreground mb-2">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 text-sm sm:text-base bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  placeholder="e.g., New York, NY"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2 sm:pt-4">
            <Button type="submit" className="flex-1 text-sm sm:text-base">
              Add Transaction
            </Button>
            {isModal && (
              <Button type="button" variant="outline" onClick={onClose} className="text-sm sm:text-base">
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
