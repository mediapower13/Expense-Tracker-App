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

export function useReceiptsByCategory(receipts: NFTReceipt[]) {
  const groupedReceipts = receipts.reduce((acc, receipt) => {
    const category = receipt.metadata.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(receipt);
    return acc;
  }, {} as Record<string, NFTReceipt[]>);

  return groupedReceipts;
}

export function useReceiptStats(receipts: NFTReceipt[]) {
  const stats = {
    totalReceipts: receipts.length,
    totalAmount: receipts.reduce((sum, r) => sum + parseFloat(r.metadata.amount || '0'), 0),
    categories: new Set(receipts.map(r => r.metadata.category)).size,
    latestReceipt: receipts.length > 0 ? receipts[receipts.length - 1] : null,
    oldestReceipt: receipts.length > 0 ? receipts[0] : null
  };

  return stats;
}

export function useSearchReceipts(receipts: NFTReceipt[], searchTerm: string) {
  const filtered = receipts.filter(receipt => {
    const term = searchTerm.toLowerCase();
    return (
      receipt.metadata.description?.toLowerCase().includes(term) ||
      receipt.metadata.category?.toLowerCase().includes(term) ||
      receipt.metadata.merchant?.toLowerCase().includes(term) ||
      receipt.tokenId.includes(term)
    );
  });

  return filtered;
}
