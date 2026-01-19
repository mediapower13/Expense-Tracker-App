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

  useEffect(() => {
    if (address) {
      loadTransactions();
    }
  }, [address, page]);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      // In production, fetch real transaction history
      const mockTransactions: BlockchainTransaction[] = Array.from({ length: limit }, (_, i) => ({
        id: `tx-${i}`,
        hash: `0x${Math.random().toString(16).substr(2, 64)}`,
        from: address,
        to: `0x${Math.random().toString(16).substr(2, 40)}`,
        value: (Math.random() * 10).toFixed(4),
        timestamp: Date.now() - i * 3600000,
        blockNumber: 18000000 + i,
        status: Math.random() > 0.1 ? 'confirmed' : 'pending' as const,
        type: ['expense', 'income', 'transfer'][Math.floor(Math.random() * 3)] as any,
        confirmations: Math.floor(Math.random() * 50)
      }));
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
        return 'text-green-600 dark:text-green-400';
      case 'pending':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'failed':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Transaction History</h3>
        <Button onClick={loadTransactions} disabled={loading} size="sm" variant="outline">
          {loading ? 'Loading...' : 'Refresh'}
        </Button>
      </div>

      {loading && transactions.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Loading transactions...
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No transactions found
        </div>
      ) : (
        <div className="space-y-2">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <p className="font-mono text-sm font-semibold">{shortenHash(tx.hash)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDate(tx.timestamp)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{tx.value} ETH</p>
                  <p className={`text-xs capitalize ${getStatusColor(tx.status)}`}>
                    {tx.status}
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>Block: {tx.blockNumber}</span>
                {tx.confirmations !== undefined && (
                  <span>{tx.confirmations} confirmations</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {transactions.length > 0 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => p + 1)}
            disabled={loading}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
