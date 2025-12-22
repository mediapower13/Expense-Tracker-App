export interface TransactionAnalytics {
  totalTransactions: number;
  totalVolume: string;
  averageGasPrice: number;
  successRate: number;
  period: string;
}

export interface GasAnalytics {
  averageGasUsed: number;
  totalGasCost: string;
  mostExpensiveTransaction: {
    hash: string;
    gasCost: string;
  };
  optimization: string[];
}

export class Web3Analytics {
  static analyzeTransactions(transactions: any[]): TransactionAnalytics {
    const successful = transactions.filter(tx => tx.status === 'confirmed');
    const totalVolume = transactions.reduce((sum, tx) => sum + parseFloat(tx.value || '0'), 0);

    return {
      totalTransactions: transactions.length,
      totalVolume: totalVolume.toFixed(4),
      averageGasPrice: transactions.reduce((sum, tx) => sum + (tx.gasPrice || 0), 0) / transactions.length,
      successRate: (successful.length / transactions.length) * 100,
      period: 'last_30_days'
    };
  }

  static analyzeGasUsage(transactions: any[]): GasAnalytics {
    const gasUsed = transactions.map(tx => tx.gasUsed || 0);
    const gasCosts = transactions.map(tx => parseFloat(tx.gasCost || '0'));
    
    const mostExpensive = transactions.reduce((max, tx) => {
      const current = parseFloat(tx.gasCost || '0');
      const maxCost = parseFloat(max.gasCost || '0');
      return current > maxCost ? tx : max;
    }, transactions[0] || {});

    return {
      averageGasUsed: gasUsed.reduce((a, b) => a + b, 0) / gasUsed.length,
      totalGasCost: gasCosts.reduce((a, b) => a + b, 0).toFixed(6),
      mostExpensiveTransaction: {
        hash: mostExpensive.hash || '',
        gasCost: mostExpensive.gasCost || '0'
      },
      optimization: this.getGasOptimizationTips(gasUsed)
    };
  }

  private static getGasOptimizationTips(gasUsed: number[]): string[] {
    const tips: string[] = [];
    const avgGas = gasUsed.reduce((a, b) => a + b, 0) / gasUsed.length;

    if (avgGas > 100000) {
      tips.push('Consider batching transactions to reduce gas costs');
    }
    if (gasUsed.some(g => g > 200000)) {
      tips.push('Some transactions use excessive gas - optimize contract interactions');
    }
    tips.push('Use gas price estimators before sending transactions');
    
    return tips;
  }

  static calculateROI(investment: number, currentValue: number, gasCosts: number): number {
    return ((currentValue - investment - gasCosts) / investment) * 100;
  }

  static predictGasTrends(historicalData: number[]): { trend: string; prediction: number } {
    if (historicalData.length < 2) {
      return { trend: 'insufficient_data', prediction: 0 };
    }

    const recent = historicalData.slice(-5);
    const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const trend = recent[recent.length - 1] > recent[0] ? 'increasing' : 'decreasing';

    return {
      trend,
      prediction: avg
    };
  }
}
