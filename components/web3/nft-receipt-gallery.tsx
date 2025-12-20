'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface NFTReceipt {
  tokenId: string;
  amount: string;
  category: string;
  description: string;
  timestamp: number;
  imageUrl?: string;
}

export function NFTReceiptGallery() {
  const [receipts, setReceipts] = useState<NFTReceipt[]>([]);
  const [loading, setLoading] = useState(false);

  const loadReceipts = async () => {
    setLoading(true);
    try {
      // Mock NFT receipts
      const mockReceipts: NFTReceipt[] = [
        {
          tokenId: '1',
          amount: '50.00',
          category: 'Food',
          description: 'Restaurant expense',
          timestamp: Date.now() / 1000,
          imageUrl: 'https://via.placeholder.com/150'
        },
        {
          tokenId: '2',
          amount: '100.00',
          category: 'Transport',
          description: 'Gas station',
          timestamp: Date.now() / 1000 - 86400,
          imageUrl: 'https://via.placeholder.com/150'
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">NFT Receipt Gallery</h3>
        <Button onClick={loadReceipts} disabled={loading} size="sm">
          {loading ? 'Loading...' : 'Load Receipts'}
        </Button>
      </div>

      {receipts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {receipts.map((receipt) => (
            <div key={receipt.tokenId} className="border rounded-lg overflow-hidden">
              {receipt.imageUrl && (
                <img 
                  src={receipt.imageUrl} 
                  alt={`Receipt #${receipt.tokenId}`}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-xs text-muted-foreground">
                    Token #{receipt.tokenId}
                  </span>
                  <span className="font-bold">${receipt.amount}</span>
                </div>
                <p className="font-semibold">{receipt.category}</p>
                <p className="text-sm text-muted-foreground">
                  {receipt.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(receipt.timestamp * 1000).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 space-y-4">
          <p className="text-muted-foreground">
            No NFT receipts yet. Create your first receipt!
          </p>
          <Button onClick={() => mintReceipt('10.00', 'Test', 'Sample receipt')}>
            Mint Sample Receipt
          </Button>
        </div>
      )}
    </div>
  );
}
