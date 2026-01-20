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

interface SpeedOption {
  speed: 'slow' | 'standard' | 'fast';
  label: string;
  description: string;
  estimatedTime: string;
}

export function GasEstimator() {
  const [estimates, setEstimates] = useState<Record<string, GasEstimate>>({});
  const [loading, setLoading] = useState(false);
  const [selectedSpeed, setSelectedSpeed] = useState<'slow' | 'standard' | 'fast'>('standard');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const speedOptions: SpeedOption[] = [
    { speed: 'slow', label: '🐢 Slow', description: 'Lower fees', estimatedTime: '~5 min' },
    { speed: 'standard', label: '⚡ Standard', description: 'Balanced', estimatedTime: '~2 min' },
    { speed: 'fast', label: '🚀 Fast', description: 'Higher fees', estimatedTime: '~30 sec' }
  ];

  useEffect(() => {
    estimateGas();
    if (autoRefresh) {
      const interval = setInterval(estimateGas, 15000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const estimateGas = async () => {
    setLoading(true);
    try {
      // Enhanced mock gas estimation with multiple speed options
      const baseGasPrice = 25000000000; // 25 Gwei
      const mockEstimates: Record<string, GasEstimate> = {
        slow: {
          gasLimit: '21000',
          gasPrice: (baseGasPrice * 0.8).toString(),
          estimatedCostETH: '0.00042',
          estimatedCostUSD: 0.84,
          maxFeePerGas: (baseGasPrice * 0.8).toString(),
          maxPriorityFeePerGas: '1000000000',
          speed: 'slow'
        },
        standard: {
          gasLimit: '21000',
          gasPrice: baseGasPrice.toString(),
          estimatedCostETH: '0.000525',
          estimatedCostUSD: 1.05,
          maxFeePerGas: baseGasPrice.toString(),
          maxPriorityFeePerGas: '1500000000',
          speed: 'standard'
        },
        fast: {
          gasLimit: '21000',
          gasPrice: (baseGasPrice * 1.3).toString(),
          estimatedCostETH: '0.0006825',
          estimatedCostUSD: 1.37,
          maxFeePerGas: (baseGasPrice * 1.3).toString(),
          maxPriorityFeePerGas: '2000000000',
          speed: 'fast'
        }
      };
      setEstimates(mockEstimates);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error estimating gas:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">⛽ Gas Fee Estimator</h3>
          {lastUpdated && (
            <p className="text-xs text-muted-foreground">
              Updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button 
            variant={autoRefresh ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? '🔄 Auto' : '⏸ Manual'}
          </Button>
          <Button onClick={estimateGas} disabled={loading} size="sm">
            {loading ? '...' : '↻'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {speedOptions.map((option) => {
          const estimate = estimates[option.speed];
          const isSelected = selectedSpeed === option.speed;
          
          return (
            <div
              key={option.speed}
              onClick={() => setSelectedSpeed(option.speed)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                isSelected 
                  ? 'border-primary bg-primary/5 shadow-md' 
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold">{option.label}</span>
                  {isSelected && <span className="text-primary">✓</span>}
                </div>
                <p className="text-xs text-muted-foreground">{option.description}</p>
                <p className="text-xs text-muted-foreground">{option.estimatedTime}</p>
                
                {estimate && (
                  <>
                    <div className="pt-2 border-t">
                      <p className="text-sm font-semibold">{estimate.estimatedCostETH} ETH</p>
                      <p className="text-xs text-green-600 dark:text-green-400">
                        ≈ ${estimate.estimatedCostUSD.toFixed(2)} USD
                      </p>
                    </div>
                    <div className="text-xs space-y-1 text-muted-foreground">
                      <p>Gas: {(parseInt(estimate.gasPrice) / 1e9).toFixed(2)} Gwei</p>
                      <p>Limit: {estimate.gasLimit}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {estimates[selectedSpeed] && (
        <div className="p-4 bg-muted/50 rounded-lg space-y-2">
          <h4 className="font-semibold text-sm">Selected: {speedOptions.find(o => o.speed === selectedSpeed)?.label}</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground">Max Fee Per Gas</p>
              <p className="font-mono">
                {estimates[selectedSpeed].maxFeePerGas ? 
                  `${(parseInt(estimates[selectedSpeed].maxFeePerGas!) / 1e9).toFixed(2)} Gwei` 
                  : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Priority Fee</p>
              <p className="font-mono">
                {estimates[selectedSpeed].maxPriorityFeePerGas ? 
                  `${(parseInt(estimates[selectedSpeed].maxPriorityFeePerGas!) / 1e9).toFixed(2)} Gwei` 
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
