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

export function useTransactionStatus(txHash: string | null) {
  const [status, setStatus] = useState<'pending' | 'confirmed' | 'failed' | null>(null);
  const [confirmations, setConfirmations] = useState(0);
  const [loading, setLoading] = useState(false);

  const checkStatus = useCallback(async () => {
    if (!txHash) return;

    setLoading(true);
    try {
      // Mock implementation - in production, query actual blockchain
      const mockStatus: 'confirmed' | 'failed' = Math.random() > 0.1 ? 'confirmed' : 'failed';
      setStatus(mockStatus);
      setConfirmations(Math.floor(Math.random() * 10) + 1);
    } catch (err) {
      console.error('Error checking transaction status:', err);
    } finally {
      setLoading(false);
    }
  }, [txHash]);

  return { status, confirmations, loading, checkStatus };
}

export function useGasEstimate(to: string | null, value: string) {
  const [estimate, setEstimate] = useState<{ gasLimit: string; gasPrice: string; totalCost: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const estimateGas = useCallback(async () => {
    if (!to || !value) return;

    setLoading(true);
    try {
      // Mock implementation
      const gasLimit = '21000';
      const gasPrice = '25000000000'; // 25 Gwei
      const totalCost = (BigInt(gasLimit) * BigInt(gasPrice)).toString();
      
      setEstimate({ gasLimit, gasPrice, totalCost });
    } catch (err) {
      console.error('Error estimating gas:', err);
    } finally {
      setLoading(false);
    }
  }, [to, value]);

  return { estimate, loading, estimateGas };
}
