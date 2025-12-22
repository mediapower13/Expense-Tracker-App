export interface WalletData {
  address: string;
  chainId: number;
  lastConnected: number;
}

export interface TransactionCache {
  hash: string;
  data: any;
  timestamp: number;
}

export class Web3Storage {
  private static readonly WALLET_KEY = 'web3_wallet';
  private static readonly TX_CACHE_KEY = 'web3_tx_cache';
  private static readonly SETTINGS_KEY = 'web3_settings';

  static saveWallet(wallet: WalletData): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.WALLET_KEY, JSON.stringify(wallet));
    } catch (error) {
      console.error('Failed to save wallet data:', error);
    }
  }

  static getWallet(): WalletData | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const data = localStorage.getItem(this.WALLET_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get wallet data:', error);
      return null;
    }
  }

  static clearWallet(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.WALLET_KEY);
  }

  static cacheTransaction(hash: string, data: any): void {
    if (typeof window === 'undefined') return;
    
    try {
      const cache = this.getTransactionCache();
      cache[hash] = {
        hash,
        data,
        timestamp: Date.now()
      };

      // Keep only last 50 transactions
      const entries = Object.entries(cache);
      if (entries.length > 50) {
        const sorted = entries.sort((a, b) => b[1].timestamp - a[1].timestamp);
        const limited = Object.fromEntries(sorted.slice(0, 50));
        localStorage.setItem(this.TX_CACHE_KEY, JSON.stringify(limited));
      } else {
        localStorage.setItem(this.TX_CACHE_KEY, JSON.stringify(cache));
      }
    } catch (error) {
      console.error('Failed to cache transaction:', error);
    }
  }

  static getCachedTransaction(hash: string): TransactionCache | null {
    if (typeof window === 'undefined') return null;
    
    const cache = this.getTransactionCache();
    return cache[hash] || null;
  }

  static getTransactionCache(): Record<string, TransactionCache> {
    if (typeof window === 'undefined') return {};
    
    try {
      const data = localStorage.getItem(this.TX_CACHE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Failed to get transaction cache:', error);
      return {};
    }
  }

  static clearTransactionCache(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.TX_CACHE_KEY);
  }

  static saveSettings(settings: Record<string, any>): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }

  static getSettings(): Record<string, any> {
    if (typeof window === 'undefined') return {};
    
    try {
      const data = localStorage.getItem(this.SETTINGS_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Failed to get settings:', error);
      return {};
    }
  }

  static clearAll(): void {
    if (typeof window === 'undefined') return;
    
    this.clearWallet();
    this.clearTransactionCache();
    localStorage.removeItem(this.SETTINGS_KEY);
  }
}
