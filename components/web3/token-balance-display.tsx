'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { BlockchainUtils } from '@/lib/blockchain-utils';

interface TokenBalance {
  symbol: string;
  balance: string;
  decimals: number;
  valueUSD?: number;
  priceChange24h?: number;
  tokenAddress?: string;
}

interface TokenBalanceDisplayProps {
  address: string;
  autoRefresh?: boolean;
}

export function TokenBalanceDisplay({ address, autoRefresh = false }: TokenBalanceDisplayProps) {
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalValueUSD, setTotalValueUSD] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (address) {
      fetchBalances();
    }
    if (autoRefresh) {
      const interval = setInterval(fetchBalances, 30000);
      return () => clearInterval(interval);
    }
  }, [address, autoRefresh]);

  const fetchBalances = async () => {
    setLoading(true);
    setError(null);
    try {
      // Enhanced mock balances with USD values and price changes
      const mockBalances: TokenBalance[] = [
        { 
          symbol: 'USDC', 
          balance: '1000.50', 
          decimals: 6,
          valueUSD: 1000.50,
          priceChange24h: 0.02,
          tokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
        },
        { 
          symbol: 'USDT', 
          balance: '500.25', 
          decimals: 6,
          valueUSD: 500.15,
          priceChange24h: -0.01,
          tokenAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7'
        },
        { 
          symbol: 'DAI', 
          balance: '250.75', 
          decimals: 18,
          valueUSD: 251.00,
          priceChange24h: 0.15,
          tokenAddress: '0x6b175474e89094c44da98b954eedeac495271d0f'
        }
      ];
      setBalances(mockBalances);
      const total = mockBalances.reduce((sum, token) => sum + (token.valueUSD || 0), 0);
      setTotalValueUSD(total);
    } catch (error) {
      console.error('Error fetching balances:', error);
      setError('Failed to load token balances');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Token Balances</h3>
          {totalValueUSD > 0 && (
            <p className="text-sm text-muted-foreground">
              Total: ${totalValueUSD.toFixed(2)} USD
            </p>
          )}
        </div>
        <Button onClick={fetchBalances} disabled={loading} size="sm">
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

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {balances.length > 0 ? (
        <div className="space-y-2">
          {balances.map((token) => (
            <div 
              key={token.symbol} 
              className="flex justify-between items-center p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-lg">{token.symbol}</p>
                  {token.priceChange24h !== undefined && (
                    <span className={`text-xs px-2 py-0.5 rounded ${token.priceChange24h >= 0 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
                      {token.priceChange24h >= 0 ? '↗' : '↘'} {Math.abs(token.priceChange24h).toFixed(2)}%
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {token.tokenAddress && `${token.tokenAddress.substring(0, 10)}...`}
                </p>
                {token.valueUSD !== undefined && (
                  <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                    ${token.valueUSD.toFixed(2)} USD
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">{token.balance}</p>
                <p className="text-xs text-muted-foreground">
                  {token.decimals} decimals
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 space-y-3">
          <div className="text-4xl">💰</div>
          <p className="text-muted-foreground">
            {loading ? 'Loading token balances...' : 'No token balances to display'}
          </p>
          {!loading && (
            <Button onClick={fetchBalances} variant="outline" size="sm">
              Load Balances
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
