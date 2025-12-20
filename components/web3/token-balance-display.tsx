'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BlockchainUtils } from '@/lib/blockchain-utils';

interface TokenBalance {
  symbol: string;
  balance: string;
  decimals: number;
}

interface TokenBalanceDisplayProps {
  address: string;
}

export function TokenBalanceDisplay({ address }: TokenBalanceDisplayProps) {
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBalances = async () => {
    setLoading(true);
    try {
      // In production, fetch real token balances
      const mockBalances: TokenBalance[] = [
        { symbol: 'USDC', balance: '1000.50', decimals: 6 },
        { symbol: 'USDT', balance: '500.25', decimals: 6 },
        { symbol: 'DAI', balance: '250.75', decimals: 18 }
      ];
      setBalances(mockBalances);
    } catch (error) {
      console.error('Error fetching balances:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Token Balances</h3>
        <Button onClick={fetchBalances} disabled={loading} size="sm">
          {loading ? 'Loading...' : 'Refresh'}
        </Button>
      </div>

      {balances.length > 0 ? (
        <div className="space-y-2">
          {balances.map((token) => (
            <div 
              key={token.symbol} 
              className="flex justify-between items-center p-3 border rounded-lg"
            >
              <div>
                <p className="font-semibold">{token.symbol}</p>
                <p className="text-sm text-muted-foreground">
                  Decimals: {token.decimals}
                </p>
              </div>
              <p className="text-lg font-bold">{token.balance}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-8">
          No token balances to display. Click refresh to load.
        </p>
      )}
    </div>
  );
}
