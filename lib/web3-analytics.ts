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

  static getTransactionsByPeriod(
    transactions: any[],
    period: 'day' | 'week' | 'month'
  ): Record<string, any[]> {
    const now = Date.now();
    const periodMs = {
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000
    }[period];

    const grouped: Record<string, any[]> = {};

    transactions.forEach(tx => {
      const txTime = tx.timestamp * 1000;
      if (now - txTime <= periodMs) {
        const date = new Date(txTime).toLocaleDateString();
        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(tx);
      }
    });

    return grouped;
  }

  static calculateAverageTransactionValue(transactions: any[]): number {
    if (transactions.length === 0) return 0;
    const total = transactions.reduce((sum, tx) => sum + parseFloat(tx.value || '0'), 0);
    return total / transactions.length;
  }

  static getTopRecipients(transactions: any[], limit: number = 5): Array<{ address: string; count: number; totalValue: string }> {
    const recipientMap: Record<string, { count: number; totalValue: number }> = {};

    transactions.forEach(tx => {
      if (tx.to) {
        if (!recipientMap[tx.to]) {
          recipientMap[tx.to] = { count: 0, totalValue: 0 };
        }
        recipientMap[tx.to].count++;
        recipientMap[tx.to].totalValue += parseFloat(tx.value || '0');
      }
    });

    return Object.entries(recipientMap)
      .map(([address, data]) => ({
        address,
        count: data.count,
        totalValue: data.totalValue.toFixed(4)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  static getFailureRate(transactions: any[]): number {
    if (transactions.length === 0) return 0;
    const failed = transactions.filter(tx => tx.status === 'failed').length;
    return (failed / transactions.length) * 100;
  }

  static estimateMonthlyCosts(recentTransactions: any[]): { gas: string; total: string } {
    const dailyAvg = recentTransactions
      .slice(-7)
      .reduce((sum, tx) => sum + parseFloat(tx.gasCost || '0'), 0) / 7;
    
    const monthlyGas = dailyAvg * 30;
    
    return {
      gas: monthlyGas.toFixed(6),
      total: monthlyGas.toFixed(6)
    };
  }

  static getTransactionTrend(transactions: any[], days: number = 7): { direction: 'up' | 'down' | 'stable'; percentage: number } {
    if (transactions.length < 2) return { direction: 'stable', percentage: 0 };

    const now = Date.now();
    const cutoff = now - (days * 24 * 60 * 60 * 1000);
    const recent = transactions.filter(tx => (tx.timestamp * 1000) > cutoff);
    
    const firstHalf = recent.slice(0, Math.floor(recent.length / 2)).length;
    const secondHalf = recent.slice(Math.floor(recent.length / 2)).length;
    
    if (firstHalf === 0) return { direction: 'stable', percentage: 0 };
    
    const change = ((secondHalf - firstHalf) / firstHalf) * 100;
    const direction = change > 5 ? 'up' : change < -5 ? 'down' : 'stable';
    
    return { direction, percentage: Math.abs(change) };
  }

  static getMostActiveHours(transactions: any[]): Record<number, number> {
    const hourCounts: Record<number, number> = {};
    
    transactions.forEach(tx => {
      const hour = new Date(tx.timestamp * 1000).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    
    return hourCounts;
  }

  static getAverageConfirmationTime(transactions: any[]): number {
    const confirmed = transactions.filter(tx => tx.status === 'confirmed' && tx.confirmationTime);
    if (confirmed.length === 0) return 0;
    
    const totalTime = confirmed.reduce((sum, tx) => sum + (tx.confirmationTime || 0), 0);
    return totalTime / confirmed.length;
  }
}
