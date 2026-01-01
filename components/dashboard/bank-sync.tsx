"use client"

import { useState, useEffect } from "react"
import { RefreshCw, Download, CheckCircle2, AlertCircle, Clock, TrendingUp, TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { BankAccount, BankSync } from "@/lib/store"

export function BankSyncPanel() {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([])
  const [syncHistory, setSyncHistory] = useState<BankSync[]>([])
  const [syncing, setSyncing] = useState<string | null>(null)
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(false)

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadData = async () => {
    try {
      const [accountsRes, syncRes] = await Promise.all([
        fetch("/api/banks"),
        fetch("/api/banks/sync-history"),
      ])

      const accountsData = await accountsRes.json()
      const syncData = await syncRes.json()

      setBankAccounts(accountsData.accounts || [])
      setSyncHistory(syncData.history || [])
    } catch (error) {
      console.error("Failed to load sync data:", error)
    }
  }

  const handleSync = async (accountId: string) => {
    setSyncing(accountId)

    try {
      const response = await fetch("/api/banks/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId }),
      })

      const result = await response.json()

      if (response.ok) {
        alert(`Successfully synced ${result.transactionsSynced} transactions!`)
        await loadData()
      } else {
        alert(`Sync failed: ${result.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Sync failed:", error)
      alert("Failed to sync transactions")
    } finally {
      setSyncing(null)
    }
  }

  const handleSyncAll = async () => {
    for (const account of bankAccounts.filter((a) => a.isActive)) {
      await handleSync(account.id)
    }
  }

  const getSyncStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-success" />
      case "failed":
        return <AlertCircle className="h-5 w-5 text-destructive" />
      case "syncing":
        return <RefreshCw className="h-5 w-5 text-primary animate-spin" />
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-card-foreground">Bank Sync</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Sync transactions from your connected bank accounts
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setAutoSyncEnabled(!autoSyncEnabled)}
            className={autoSyncEnabled ? "bg-primary/10" : ""}
          >
            {autoSyncEnabled ? "Auto-Sync: ON" : "Auto-Sync: OFF"}
          </Button>
          <Button onClick={handleSyncAll} disabled={syncing !== null} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
            Sync All Accounts
          </Button>
        </div>
      </div>

      {/* Active Bank Accounts */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Download className="h-5 w-5 text-primary" />
          Connected Accounts
        </h3>
        <div className="space-y-3">
          {bankAccounts.filter((a) => a.isActive).length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No active bank accounts connected. Add a bank account to start syncing.
            </p>
          ) : (
            bankAccounts
              .filter((a) => a.isActive)
              .map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="font-semibold text-card-foreground">{account.accountName}</div>
                      <div className="text-sm text-muted-foreground">
                        {account.bankName} - ****{account.accountNumber}
                      </div>
                    </div>
                    {account.lastSyncedAt && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Last synced: {new Date(account.lastSyncedAt).toLocaleString()}
                      </div>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSync(account.id)}
                    disabled={syncing === account.id}
                    className="gap-2 ml-4"
                  >
                    <RefreshCw className={`h-3 w-3 ${syncing === account.id ? "animate-spin" : ""}`} />
                    {syncing === account.id ? "Syncing..." : "Sync Now"}
                  </Button>
                </div>
              ))
          )}
        </div>
      </div>

      {/* Sync History */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Sync History</h3>
        <div className="space-y-2">
          {syncHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No sync history yet. Sync your bank accounts to see history here.
            </p>
          ) : (
            <div className="space-y-2">
              {syncHistory.slice(0, 10).map((sync) => {
                const account = bankAccounts.find((a) => a.id === sync.bankAccountId)
                return (
                  <div
                    key={sync.id}
                    className="flex items-center justify-between p-3 bg-muted/20 rounded-lg hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {getSyncStatusIcon(sync.status)}
                      <div>
                        <div className="text-sm font-medium text-card-foreground">
                          {account?.accountName || "Unknown Account"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {sync.lastSyncTime && new Date(sync.lastSyncTime).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {sync.status === "success" ? (
                        <div className="flex items-center gap-2 text-sm">
                          <TrendingUp className="h-4 w-4 text-success" />
                          <span className="font-medium text-success">
                            {sync.transactionsSynced} transactions
                          </span>
                        </div>
                      ) : sync.status === "failed" ? (
                        <div className="text-xs text-destructive">{sync.error || "Sync failed"}</div>
                      ) : (
                        <div className="text-xs text-muted-foreground">In progress...</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Sync Info */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
        <h4 className="font-semibold text-card-foreground mb-2 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-primary" />
          How Bank Sync Works
        </h4>
        <ul className="text-sm text-muted-foreground space-y-2 ml-7">
          <li>• Automatically imports transactions from your connected bank accounts</li>
          <li>• Synced transactions are marked with a bank icon</li>
          <li>• Categories are auto-assigned based on merchant information</li>
          <li>• You can edit or delete synced transactions as needed</li>
          <li>• Enable auto-sync to automatically sync transactions daily</li>
        </ul>
      </div>
    </div>
  )
}
