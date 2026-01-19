'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface GasEstimate {
  gasLimit: string;
  gasPrice: string;
  estimatedCostETH: string;
  estimatedCostUSD: number;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
  speed: 'slow' | 'standard' | 'fast';
}

export function GasEstimator() {
  const [estimate, setEstimate] = useState<GasEstimate | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedSpeed, setSelectedSpeed] = useState<'slow' | 'standard' | 'fast'>('standard');

  const estimateGas = async () => {
    setLoading(true);
    try {
      // Mock gas estimation
      const mockEstimate: GasEstimate = {
        gasLimit: '21000',
        gasPrice: '25000000000', // 25 Gwei
        estimatedCostETH: '0.000525',
        estimatedCostUSD: 1.05
      };
      setEstimate(mockEstimate);
    } catch (error) {
      console.error('Error estimating gas:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">Gas Fee Estimator</h3>
      
      <Button onClick={estimateGas} disabled={loading} className="w-full">
        {loading ? 'Estimating...' : 'Estimate Gas Fees'}
      </Button>

      {estimate && (
        <div className="space-y-2 mt-4">
          <div className="flex justify-between p-2 bg-muted rounded">
            <span className="text-sm">Gas Limit:</span>
            <span className="font-mono font-semibold">{estimate.gasLimit}</span>
          </div>
          <div className="flex justify-between p-2 bg-muted rounded">
            <span className="text-sm">Gas Price:</span>
            <span className="font-mono font-semibold">
              {(parseInt(estimate.gasPrice) / 1e9).toFixed(2)} Gwei
            </span>
          </div>
          <div className="flex justify-between p-2 bg-muted rounded">
            <span className="text-sm">Est. Cost (ETH):</span>
            <span className="font-mono font-semibold">{estimate.estimatedCostETH}</span>
          </div>
          <div className="flex justify-between p-2 bg-primary/10 rounded">
            <span className="text-sm font-semibold">Est. Cost (USD):</span>
            <span className="font-mono font-bold text-lg">
              ${estimate.estimatedCostUSD.toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
