"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, RefreshCw, CheckCircle2, XCircle, Building2, CreditCard, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SUPPORTED_BANKS } from "@/lib/bank-types"
import type { BankAccount } from "@/lib/store"

export function BankConnection() {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [formData, setFormData] = useState<{
    bankName: string
    accountName: string
    accountNumber: string
    accountType: "checking" | "savings" | "credit_card" | "investment"
    balance: number
  }>({
    bankName: "",
    accountName: "",
    accountNumber: "",
    accountType: "checking",
    balance: 0,
  })

  useEffect(() => {
    loadBankAccounts()
  }, [])

  const loadBankAccounts = async () => {
    try {
      const response = await fetch("/api/banks")
      if (!response.ok) {
        throw new Error(`Failed to fetch bank accounts: ${response.statusText}`)
      }
      const data = await response.json()
      setBankAccounts(data.accounts || [])
      setError(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load bank accounts"
      setError(errorMessage)
      console.error("Failed to load bank accounts:", err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch("/api/banks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          currency: "USD",
          isActive: true,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: response.statusText }))
        throw new Error(errorData.error || "Failed to add bank account")
      }

      await loadBankAccounts()
      setShowForm(false)
      setFormData({
        bankName: "",
        accountName: "",
        accountNumber: "",
        accountType: "checking",
        balance: 0,
      })
      setSuccess("Bank account added successfully!")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add bank account"
      setError(errorMessage)
      console.error("Failed to add bank account:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    // Using window.confirm is acceptable for simple confirmations in client components
    if (typeof window !== 'undefined' && !window.confirm("Are you sure you want to remove this bank account?")) {
      return
    }

    try {
      const response = await fetch(`/api/banks?id=${id}`, { method: "DELETE" })
      if (!response.ok) {
        throw new Error("Failed to delete bank account")
      }
      await loadBankAccounts()
      setSuccess("Bank account removed successfully!")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete bank account"
      setError(errorMessage)
      console.error("Failed to delete bank account:", err)
    }
  }

  const handleSync = async (accountId: string) => {
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch("/api/banks/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: response.statusText }))
        throw new Error(errorData.error || "Failed to sync bank account")
      }

      await loadBankAccounts()
      setSuccess("Bank account synced successfully!")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to sync bank account"
      setError(errorMessage)
      console.error("Failed to sync bank account:", err)
    }
  }

  const getAccountIcon = (type: string) => {
    switch (type) {
      case "checking":
        return <Wallet className="h-5 w-5" />
      case "savings":
        return <Building2 className="h-5 w-5" />
      case "credit_card":
        return <CreditCard className="h-5 w-5" />
      default:
        return <Building2 className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-card-foreground">Bank Connections</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Connect your bank accounts to automatically sync transactions
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Bank Account
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg">
          <p className="text-sm font-medium">{success}</p>
        </div>
      )}

      {showForm && (
        <div className="bg-card rounded-xl border border-border p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Add New Bank Account</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="bank-name" className="block text-sm font-medium mb-2">Bank Name</label>
              <select
                id="bank-name"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                required
                className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select a bank</option>
                {SUPPORTED_BANKS.map((bank) => (
                  <option key={bank.id} value={bank.name}>
                    {bank.logo} {bank.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="account-name" className="block text-sm font-medium mb-2">Account Name</label>
              <input
                id="account-name"
                type="text"
                value={formData.accountName}
                onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                required
                placeholder="e.g., My Checking Account"
                className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="account-number" className="block text-sm font-medium mb-2">Account Number (Last 4 digits)</label>
              <input
                id="account-number"
                type="text"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                required
                maxLength={4}
                placeholder="1234"
                className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="account-type" className="block text-sm font-medium mb-2">Account Type</label>
              <select
                id="account-type"
                value={formData.accountType}
                onChange={(e) => setFormData({ ...formData, accountType: e.target.value as "checking" | "savings" | "credit_card" | "investment" })}
                className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
                <option value="credit_card">Credit Card</option>
                <option value="investment">Investment</option>
              </select>
            </div>

            <div>
              <label htmlFor="balance" className="block text-sm font-medium mb-2">Current Balance</label>
              <input
                id="balance"
                type="number"
                step="0.01"
                value={formData.balance}
                onChange={(e) => setFormData({ ...formData, balance: parseFloat(e.target.value) || 0 })}
                required
                placeholder="0.00"
                className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Adding..." : "Add Account"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {bankAccounts.map((account) => (
          <div
            key={account.id}
            className="bg-card rounded-xl border border-border p-6 shadow-lg hover:shadow-xl transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  {getAccountIcon(account.accountType)}
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground">{account.accountName}</h3>
                  <p className="text-sm text-muted-foreground">{account.bankName}</p>
                </div>
              </div>
              {account.isActive ? (
                <CheckCircle2 className="h-5 w-5 text-success" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive" />
              )}
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Account</span>
                <span className="font-medium">****{account.accountNumber}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Type</span>
                <span className="font-medium capitalize">{account.accountType.replace("_", " ")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Balance</span>
                <span className="text-lg font-bold text-primary">
                  ${account.balance.toLocaleString()}
                </span>
              </div>
              {account.lastSyncedAt && (
                <div className="text-xs text-muted-foreground pt-2 border-t border-border">
                  Last synced: {new Date(account.lastSyncedAt).toLocaleString()}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleSync(account.id)}
                className="flex-1 gap-2"
              >
                <RefreshCw className="h-3 w-3" />
                Sync
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDelete(account.id)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {bankAccounts.length === 0 && !showForm && (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-card-foreground mb-2">No bank accounts connected</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Connect your bank account to automatically track transactions
          </p>
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Your First Bank Account
          </Button>
        </div>
      )}
    </div>
  )
}
