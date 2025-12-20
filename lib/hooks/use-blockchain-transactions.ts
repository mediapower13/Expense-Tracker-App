// React hook for blockchain transactions
import { useState, useCallback } from 'react';
import type { BlockchainTransaction } from '../wallet-types';

export function useBlockchainTransactions(address: string | null) {
  const [transactions, setTransactions] = useState<BlockchainTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    if (!address) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/blockchain/transactions?address=${address}&limit=50`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      const data = await response.json();
      setTransactions(data.transactions || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  }, [address]);

  const createTransaction = useCallback(async (
    to: string,
    value: string,
    token: string = 'ETH',
    category?: string,
    description?: string
  ) => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    try {
      const response = await fetch('/api/blockchain/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: address,
          to,
          value,
          token,
          category,
          description
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create transaction');
      }

      const data = await response.json();
      
      // Refresh transactions
      await fetchTransactions();
      
      return data.transaction;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to create transaction');
    }
  }, [address, fetchTransactions]);

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    createTransaction
  };
}
