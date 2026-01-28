// Web3 Caching Layer for Performance Optimization
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export class Web3Cache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private defaultTTL: number = 60000; // 1 minute
  private maxSize: number = 1000; // Maximum cache entries

  /**
   * Set cache entry with TTL
   */
  set<T>(key: string, data: T, ttl?: number): void {
    if (!key || typeof key !== 'string') {
      throw new Error('Cache key must be a non-empty string');
    }

    // Prevent cache from growing too large
    if (this.cache.size >= this.maxSize) {
      // Remove oldest entry
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    });
  }

  /**
   * Get cache entry if not expired
   */
  get<T>(key: string): T | null {
    if (!key || typeof key !== 'string') return null;
    
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Check if cache has valid entry
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Clear specific cache entry
   */
  clear(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clearAll(): void {
    this.cache.clear();
  }

  /**
   * Clear expired cache entries
   */
  clearExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Get or set pattern - fetch if not cached
   */
  async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const data = await fetchFn();
    this.set(key, data, ttl);
    return data;
  }

  /**
   * Set default TTL
   */
  setDefaultTTL(ttl: number): void {
    if (ttl > 0) {
      this.defaultTTL = ttl;
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; maxSize: number; hitRate: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: 0 // Could be tracked with hit/miss counters
    };
  }

  /**
   * Invalidate cache entries matching pattern
   */
  invalidatePattern(pattern: RegExp): number {
    let count = 0;
    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.cache.delete(key);
        count++;
      }
    }
    return count;
  }

  /**
   * Get all cache keys
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Check cache health
   */
  healthCheck(): { healthy: boolean; expired: number; total: number } {
    const now = Date.now();
    let expired = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        expired++;
      }
    }

    return {
      healthy: expired < this.cache.size * 0.3,
      expired,
      total: this.cache.size
    };
  }
}

// Singleton instance
export const web3Cache = new Web3Cache();
