'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface NFTReceipt {
  tokenId: string;
  amount: string;
  category: string;
  description: string;
  timestamp: number;
  imageUrl?: string;
  txHash?: string;
}

export function NFTReceiptGallery() {
  const [receipts, setReceipts] = useState<NFTReceipt[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [totalValue, setTotalValue] = useState(0);

  const categories = ['all', 'Food', 'Transport', 'Shopping', 'Entertainment', 'Bills'];

  useEffect(() => {
    calculateTotal();
  }, [receipts]);

  const calculateTotal = () => {
    const total = receipts.reduce((sum, r) => sum + parseFloat(r.amount), 0);
    setTotalValue(total);
  };

  const loadReceipts = async () => {
    setLoading(true);
    try {
      // Enhanced mock NFT receipts
      const mockReceipts: NFTReceipt[] = [
        {
          tokenId: '1',
          amount: '50.00',
          category: 'Food',
          description: 'Restaurant expense',
          timestamp: Date.now() / 1000,
          imageUrl: 'https://via.placeholder.com/300x200/4CAF50/ffffff?text=Food',
          txHash: '0x1234...5678'
        },
        {
          tokenId: '2',
          amount: '100.00',
          category: 'Transport',
          description: 'Gas station',
          timestamp: Date.now() / 1000 - 86400,
          imageUrl: 'https://via.placeholder.com/300x200/2196F3/ffffff?text=Transport',
          txHash: '0xabcd...ef12'
        },
        {
          tokenId: '3',
          amount: '75.50',
          category: 'Shopping',
          description: 'Online purchase',
          timestamp: Date.now() / 1000 - 172800,
          imageUrl: 'https://via.placeholder.com/300x200/FF9800/ffffff?text=Shopping',
          txHash: '0x9876...3210'
        },
        {
          tokenId: '4',
          amount: '35.00',
          category: 'Entertainment',
          description: 'Movie tickets',
          timestamp: Date.now() / 1000 - 259200,
          imageUrl: 'https://via.placeholder.com/300x200/E91E63/ffffff?text=Entertainment',
          txHash: '0xdef0...abcd'
        }
      ];
      setReceipts(mockReceipts);
    } catch (error) {
      console.error('Error loading NFT receipts:', error);
    } finally {
      setLoading(false);
    }
  };

  const mintReceipt = async (amount: string, category: string, description: string) => {
    try {
      // Logic to mint NFT receipt
      console.log('Minting receipt:', { amount, category, description });
      alert('NFT Receipt minting functionality - connect to smart contract');
    } catch (error) {
      console.error('Error minting receipt:', error);
    }
  };

  const filteredReceipts = selectedCategory === 'all' 
    ? receipts 
    : receipts.filter(r => r.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Food': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      'Transport': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
      'Shopping': 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
      'Entertainment': 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400',
      'Bills': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
    };
    return colors[category] || 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400';
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">🎨 NFT Receipt Gallery</h3>
          {receipts.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {filteredReceipts.length} receipts · Total: ${totalValue.toFixed(2)}
            </p>
          )}
        </div>
        <Button onClick={loadReceipts} disabled={loading} size="sm">
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </span>
          ) : (
            '↻ Load Receipts'
          )}
        </Button>
      </div>

      {receipts.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'all' ? '📋 All' : cat}
              {cat !== 'all' && (
                <span className="ml-1 text-xs opacity-70">
                  ({receipts.filter(r => r.category === cat).length})
                </span>
              )}
            </Button>
          ))}
        </div>
      )}

      {filteredReceipts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReceipts.map((receipt) => (
            <div 
              key={receipt.tokenId} 
              className="border-2 rounded-lg overflow-hidden hover:shadow-lg transition-all hover:border-primary cursor-pointer"
            >
              {receipt.imageUrl && (
                <div className="relative">
                  <img 
                    src={receipt.imageUrl} 
                    alt={`Receipt #${receipt.tokenId}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-mono">
                    #{receipt.tokenId}
                  </div>
                </div>
              )}
              <div className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <span className={`text-xs px-2 py-1 rounded font-semibold ${getCategoryColor(receipt.category)}`}>
                    {receipt.category}
                  </span>
                  <span className="text-xl font-bold text-green-600 dark:text-green-400">
                    ${receipt.amount}
                  </span>
                </div>
                <p className="font-semibold text-sm">{receipt.description}</p>
                <div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
                  <span>📅 {new Date(receipt.timestamp * 1000).toLocaleDateString()}</span>
                  {receipt.txHash && (
                    <span className="font-mono">{receipt.txHash}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 space-y-4">
          <div className="text-6xl">🎫</div>
          <div>
            <p className="text-lg font-semibold">
              {receipts.length === 0 ? 'No NFT receipts yet' : 'No receipts in this category'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {receipts.length === 0 
                ? 'Create your first receipt to get started!' 
                : 'Try selecting a different category'}
            </p>
          </div>
          {receipts.length === 0 && (
            <div className="flex gap-2 justify-center">
              <Button onClick={() => mintReceipt('10.00', 'Food', 'Sample receipt')} variant="outline">
                🍕 Mint Sample
              </Button>
              <Button onClick={loadReceipts}>
                Load Examples
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
