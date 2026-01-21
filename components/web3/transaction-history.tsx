'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { BlockchainTransaction } from '@/lib/wallet-types';

interface TransactionHistoryProps {
  address: string;
  limit?: number;
}

export function TransactionHistory({ address, limit = 10 }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<BlockchainTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending' | 'failed'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'sent' | 'received'>('all');
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    if (address) {
      loadTransactions();
    }
  }, [address, page]);

  useEffect(() => {
    calculateTotal();
  }, [transactions]);

  const calculateTotal = () => {
    const total = transactions
      .filter(tx => tx.status === 'confirmed')
      .reduce((sum, tx) => sum + parseFloat(tx.value), 0);
    setTotalValue(total);
  };

  const loadTransactions = async () => {
    setLoading(true);
    try {
      // Enhanced mock transaction history
      const mockTransactions: BlockchainTransaction[] = Array.from({ length: limit }, (_, i) => {
        const isSent = Math.random() > 0.5;
        const randomStatus = Math.random();
        const status: 'confirmed' | 'pending' | 'failed' = randomStatus > 0.1 ? 'confirmed' : (randomStatus > 0.5 ? 'pending' : 'failed');
        
        return {
          id: `tx-${i}`,
          hash: `0x${Math.random().toString(16).substr(2, 64)}`,
          from: isSent ? address : `0x${Math.random().toString(16).substr(2, 40)}`,
          to: isSent ? `0x${Math.random().toString(16).substr(2, 40)}` : address,
          value: (Math.random() * 10).toFixed(4),
          timestamp: Date.now() - i * 3600000,
          blockNumber: 18000000 + i,
          status,
          type: ['expense', 'income', 'transfer'][Math.floor(Math.random() * 3)] as any,
          confirmations: Math.floor(Math.random() * 50),
          gasUsed: '21000',
          gasFee: (Math.random() * 0.001).toFixed(6)
        };
      });
      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const shortenHash = (hash: string) => {
    return `${hash.substring(0, 10)}...${hash.substring(hash.length - 8)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
      case 'failed':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return '✓';
      case 'pending': return '⏳';
      case 'failed': return '✗';
      default: return '?';
    }
  };

  const filteredTransactions = transactions
    .filter(tx => filter === 'all' || tx.status === filter)
    .filter(tx => {
      if (typeFilter === 'all') return true;
      if (typeFilter === 'sent') return tx.from.toLowerCase() === address.toLowerCase();
      if (typeFilter === 'received') return tx.to.toLowerCase() === address.toLowerCase();
      return true;
    });

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">📜 Transaction History</h3>
          <p className="text-sm text-muted-foreground">
            {filteredTransactions.length} transactions · Total: {totalValue.toFixed(4)} ETH
          </p>
        </div>
        <Button onClick={loadTransactions} disabled={loading} size="sm" variant="outline">
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </span>
          ) : (
            '↻ Refresh'
          )}
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        <div className="flex gap-2">
          {['all', 'confirmed', 'pending', 'failed'].map(status => (
            <Button
              key={status}
              variant={filter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(status as any)}
            >
              {status === 'all' ? '📋 All' : status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
        <div className="flex gap-2 ml-auto">
          {['all', 'sent', 'received'].map(type => (
            <Button
              key={type}
              variant={typeFilter === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTypeFilter(type as any)}
            >
              {type === 'sent' ? '📤' : type === 'received' ? '📥' : '🔄'} {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {loading && transactions.length === 0 ? (
        <div className="text-center py-12 space-y-3">
          <div className="text-4xl">⏳</div>
          <p className="text-muted-foreground">Loading transactions...</p>
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="text-center py-12 space-y-3">
          <div className="text-4xl">📭</div>
          <p className="text-muted-foreground">
            {transactions.length === 0 ? 'No transactions found' : 'No transactions match your filters'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTransactions.map((tx) => {
            const isSent = tx.from.toLowerCase() === address.toLowerCase();
            return (
              <div
                key={tx.id}
                className="p-4 border-2 rounded-lg hover:bg-muted/50 transition-all hover:border-primary cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{isSent ? '📤' : '📥'}</span>
                      <p className="font-mono text-sm font-semibold">{shortenHash(tx.hash)}</p>
                      <span className={`text-xs px-2 py-0.5 rounded font-semibold ${getStatusColor(tx.status)}`}>
                        {getStatusIcon(tx.status)} {tx.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground ml-7">
                      {formatDate(tx.timestamp)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-lg ${isSent ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                      {isSent ? '-' : '+'}{tx.value} ETH
                    </p>
                    {tx.gasFee && (
                      <p className="text-xs text-muted-foreground">
                        ⛽ {tx.gasFee} ETH
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground pt-2 border-t">
                  <div>
                    <p className="opacity-70">Block</p>
                    <p className="font-mono font-semibold">{tx.blockNumber}</p>
                  </div>
                  {tx.confirmations !== undefined && (
                    <div className="text-right">
                      <p className="opacity-70">Confirmations</p>
                      <p className="font-semibold">{tx.confirmations}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filteredTransactions.length > 0 && (
        <div className="flex justify-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
          >
            ← Previous
          </Button>
          <span className="px-4 py-2 text-sm text-muted-foreground">
            Page {page}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => p + 1)}
            disabled={loading}
          >
            Next →
          </Button>
        </div>
      )}
    </div>
  );
}
