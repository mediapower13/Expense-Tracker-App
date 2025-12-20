'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BlockchainUtils } from '@/lib/blockchain-utils';

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
}

export function BlockchainTransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      // Mock transactions for demonstration
      const mockTxs: Transaction[] = [
        {
          hash: '0x1234...5678',
          from: '0xabcd...ef00',
          to: '0x9876...5432',
          value: '0.5',
          timestamp: Date.now() / 1000,
          status: 'confirmed'
        },
        {
          hash: '0xaaaa...bbbb',
          from: '0xcccc...dddd',
          to: '0xeeee...ffff',
          value: '1.2',
          timestamp: Date.now() / 1000 - 3600,
          status: 'confirmed'
        }
      ];
      setTransactions(mockTxs);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Recent Transactions</h3>
        <Button onClick={loadTransactions} disabled={loading} size="sm">
          {loading ? 'Loading...' : 'Load Transactions'}
        </Button>
      </div>

      {transactions.length > 0 ? (
        <div className="space-y-2">
          {transactions.map((tx) => (
            <div key={tx.hash} className="p-4 border rounded-lg space-y-2">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="font-mono text-sm font-semibold">{tx.hash}</p>
                  <p className="text-xs text-muted-foreground">
                    From: {tx.from}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    To: {tx.to}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{tx.value} ETH</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    tx.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {tx.status}
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {BlockchainUtils.formatTimestamp(tx.timestamp)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-8">
          No transactions yet. Click to load.
        </p>
      )}
    </div>
  );
}
