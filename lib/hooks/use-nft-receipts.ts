// React hook for NFT receipts
import { useState, useCallback } from 'react';
import type { NFTReceipt } from '../wallet-types';

export function useNFTReceipts(address: string | null) {
  const [receipts, setReceipts] = useState<NFTReceipt[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReceipts = useCallback(async () => {
    if (!address) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/nft/receipts?address=${address}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch NFT receipts');
      }

      const data = await response.json();
      setReceipts(data.receipts || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch receipts');
    } finally {
      setLoading(false);
    }
  }, [address]);

  const mintReceipt = useCallback(async (
    amount: string,
    category: string,
    description: string,
    merchant?: string,
    transactionHash?: string
  ) => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    try {
      const response = await fetch('/api/nft/receipts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          amount,
          category,
          description,
          merchant,
          transactionHash
        })
      });

      if (!response.ok) {
        throw new Error('Failed to mint NFT receipt');
      }

      const data = await response.json();
      
      // Refresh receipts
      await fetchReceipts();
      
      return data.receipt;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to mint receipt');
    }
  }, [address, fetchReceipts]);

  return {
    receipts,
    loading,
    error,
    fetchReceipts,
    mintReceipt
  };
}
