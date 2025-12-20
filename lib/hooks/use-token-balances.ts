// React hook for token balances
import { useState, useCallback } from 'react';
import type { TokenBalance } from '../wallet-types';

export function useTokenBalances(address: string | null, chainId: string | null) {
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [totalValueUSD, setTotalValueUSD] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalances = useCallback(async () => {
    if (!address) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/tokens/balances?address=${address}&chainId=${chainId || '0x1'}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch token balances');
      }

      const data = await response.json();
      setBalances(data.balances || []);
      setTotalValueUSD(data.totalValueUSD || 0);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch balances');
    } finally {
      setLoading(false);
    }
  }, [address, chainId]);

  return {
    balances,
    totalValueUSD,
    loading,
    error,
    fetchBalances
  };
}
