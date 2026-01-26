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

export function useTokenPrice(symbol: string) {
  const [price, setPrice] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const fetchPrice = useCallback(async () => {
    setLoading(true);
    try {
      // In production, fetch from a real API like CoinGecko
      const mockPrices: Record<string, number> = {
        'ETH': 2000,
        'MATIC': 0.8,
        'USDC': 1,
        'USDT': 1,
        'DAI': 1,
        'BNB': 300
      };
      setPrice(mockPrices[symbol] || 0);
    } finally {
      setLoading(false);
    }
  }, [symbol]);

  return { price, loading, fetchPrice };
}

export function useTokenAllowance(
  tokenAddress: string,
  owner: string,
  spender: string
) {
  const [allowance, setAllowance] = useState<bigint>(BigInt(0));
  const [loading, setLoading] = useState(false);

  const checkAllowance = useCallback(async () => {
    if (!tokenAddress || !owner || !spender) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/tokens/allowance?token=${tokenAddress}&owner=${owner}&spender=${spender}`
      );
      const data = await response.json();
      setAllowance(BigInt(data.allowance || 0));
    } catch (err) {
      console.error('Error checking allowance:', err);
    } finally {
      setLoading(false);
    }
  }, [tokenAddress, owner, spender]);

  return { allowance, loading, checkAllowance };
}
