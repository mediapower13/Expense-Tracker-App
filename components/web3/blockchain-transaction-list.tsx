'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { BlockchainUtils } from '@/lib/blockchain-utils';

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
  type: 'expense' | 'income' | 'transfer';
  category?: string;
  gasPrice?: string;
  blockNumber?: number;
}

export function BlockchainTransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'expense' | 'income' | 'transfer'>('all');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [stats, setStats] = useState({ total: 0, expenses: 0, income: 0 });

  useEffect(() => {
    loadTransactions();
    if (autoRefresh) {
      const interval = setInterval(loadTransactions, 20000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  useEffect(() => {
    calculateStats();
  }, [transactions]);

  const calculateStats = () => {
    const total = transactions.reduce((sum, tx) => sum + parseFloat(tx.value), 0);
    const expenses = transactions
      .filter(tx => tx.type === 'expense')
      .reduce((sum, tx) => sum + parseFloat(tx.value), 0);
    const income = transactions
      .filter(tx => tx.type === 'income')
      .reduce((sum, tx) => sum + parseFloat(tx.value), 0);
    setStats({ total, expenses, income });
  };

  const loadTransactions = async () => {
    setLoading(true);
    try {
      // Enhanced mock transactions
      const types: ('expense' | 'income' | 'transfer')[] = ['expense', 'income', 'transfer'];
      const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment'];
      const mockTxs: Transaction[] = Array.from({ length: 8 }, (_, i) => ({
        hash: `0x${Math.random().toString(16).substr(2, 64)}`,
        from: `0x${Math.random().toString(16).substr(2, 40)}`,
        to: `0x${Math.random().toString(16).substr(2, 40)}`,
        value: (Math.random() * 2).toFixed(4),
        timestamp: Date.now() / 1000 - i * 7200,
        status: Math.random() > 0.2 ? 'confirmed' : (Math.random() > 0.5 ? 'pending' : 'failed'),
        type: types[Math.floor(Math.random() * types.length)],
        category: categories[Math.floor(Math.random() * categories.length)],
        gasPrice: (Math.random() * 50 + 20).toFixed(2),
        blockNumber: 18000000 + i
      }));
      setTransactions(mockTxs);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const shortenHash = (hash: string) => {
    return `${hash.substring(0, 10)}...${hash.substring(hash.length - 8)}`;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'expense': return '💸';
      case 'income': return '💰';
      case 'transfer': return '🔄';
      default: return '📝';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'expense': return 'text-red-600 dark:text-red-400';
      case 'income': return 'text-green-600 dark:text-green-400';
      case 'transfer': return 'text-blue-600 dark:text-blue-400';
      default: return 'text-gray-600';
    }
  };

  const filteredTransactions = filter === 'all' 
    ? transactions 
    : transactions.filter(tx => tx.type === filter);

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">⛓️ Blockchain Transactions</h3>
          <div className="flex gap-4 text-xs text-muted-foreground mt-1">
            <span>Total: {stats.total.toFixed(4)} ETH</span>
            <span className="text-red-600 dark:text-red-400">Expenses: {stats.expenses.toFixed(4)}</span>
            <span className="text-green-600 dark:text-green-400">Income: {stats.income.toFixed(4)}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={autoRefresh ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? '🔄' : '⏸'}
          </Button>
          <Button onClick={loadTransactions} disabled={loading} size="sm">
            {loading ? '...' : '↻'}
          </Button>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['all', 'expense', 'income', 'transfer'].map(type => (
          <Button
            key={type}
            variant={filter === type ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(type as any)}
          >
            {type === 'all' ? '📋 All' : `${getTypeIcon(type)} ${type.charAt(0).toUpperCase() + type.slice(1)}`}
            <span className="ml-1 text-xs opacity-70">
              ({type === 'all' ? transactions.length : transactions.filter(tx => tx.type === type).length})
            </span>
          </Button>
        ))}
      </div>

      {filteredTransactions.length > 0 ? (
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {filteredTransactions.map((tx) => (
            <div 
              key={tx.hash} 
              className="p-4 border-2 rounded-lg hover:bg-muted/50 transition-all hover:border-primary"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{getTypeIcon(tx.type)}</span>
                    <p className="font-mono text-sm font-semibold">{shortenHash(tx.hash)}</p>
                    <span className={`text-xs px-2 py-1 rounded font-semibold ${
                      tx.status === 'confirmed' 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : tx.status === 'pending'
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    }`}>
                      {tx.status === 'confirmed' ? '✓' : tx.status === 'pending' ? '⏳' : '✗'} {tx.status}
                    </span>
                  </div>
                  {tx.category && (
                    <p className="text-xs text-muted-foreground ml-7">
                      Category: {tx.category}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground ml-7">
                    From: {shortenHash(tx.from)}
                  </p>
                  <p className="text-xs text-muted-foreground ml-7">
                    To: {shortenHash(tx.to)}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-xl ${getTypeColor(tx.type)}`}>
                    {tx.type === 'expense' ? '-' : tx.type === 'income' ? '+' : ''}{tx.value} ETH
                  </p>
                  {tx.gasPrice && (
                    <p className="text-xs text-muted-foreground">⛽ {tx.gasPrice} Gwei</p>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center pt-2 border-t text-xs text-muted-foreground">
                <span>📅 {BlockchainUtils.formatTimestamp(tx.timestamp)}</span>
                {tx.blockNumber && (
                  <span className="font-mono">Block #{tx.blockNumber}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 space-y-3">
          <div className="text-6xl">⛓️</div>
          <div>
            <p className="text-lg font-semibold">
              {transactions.length === 0 ? 'No transactions yet' : 'No transactions in this category'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {loading ? 'Loading...' : 'Click Load Transactions to get started'}
            </p>
          </div>
          {!loading && transactions.length === 0 && (
            <Button onClick={loadTransactions}>
              Load Transactions
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
