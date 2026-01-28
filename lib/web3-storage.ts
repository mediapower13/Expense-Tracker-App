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

  static saveFavoriteAddress(label: string, address: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      const favorites = this.getFavoriteAddresses();
      favorites[address] = { label, address, timestamp: Date.now() };
      localStorage.setItem('web3_favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Failed to save favorite address:', error);
    }
  }

  static getFavoriteAddresses(): Record<string, { label: string; address: string; timestamp: number }> {
    if (typeof window === 'undefined') return {};
    
    try {
      const data = localStorage.getItem('web3_favorites');
      return data ? JSON.parse(data) : {};
    } catch (error) {
      return {};
    }
  }

  static removeFavoriteAddress(address: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      const favorites = this.getFavoriteAddresses();
      delete favorites[address];
      localStorage.setItem('web3_favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Failed to remove favorite address:', error);
    }
  }

  static getStorageSize(): number {
    if (typeof window === 'undefined') return 0;
    
    let total = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return total;
  }

  static isStorageAvailable(): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Clear all Web3 related storage
   */
  static clearAllWeb3Storage(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(this.WALLET_KEY);
      localStorage.removeItem(this.TX_CACHE_KEY);
      localStorage.removeItem(this.SETTINGS_KEY);
      localStorage.removeItem('web3_favorites');
    } catch (error) {
      console.error('Failed to clear Web3 storage:', error);
    }
  }

  /**
   * Export all Web3 data
   */
  static exportData(): string | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const data = {
        wallet: this.getWallet(),
        settings: this.getSettings(),
        favorites: this.getFavoriteAddresses(),
        timestamp: Date.now()
      };
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Failed to export data:', error);
      return null;
    }
  }

  /**
   * Import Web3 data
   */
  static importData(jsonData: string): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      const data = JSON.parse(jsonData);
      
      if (data.wallet) this.saveWallet(data.wallet);
      if (data.settings) this.saveSettings(data.settings);
      if (data.favorites) {
        localStorage.setItem('web3_favorites', JSON.stringify(data.favorites));
      }
      
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }

  /**
   * Get storage quota info
   */
  static getQuotaInfo(): { used: number; available: number; percentage: number } {
    const used = this.getStorageSize();
    const available = 5 * 1024 * 1024; // Typical 5MB limit
    
    return {
      used,
      available,
      percentage: (used / available) * 100
    };
  }
}

