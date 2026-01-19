'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { WEB3_CONFIG } from '@/lib/web3-config';

interface Network {
  chainId: string;
  chainName: string;
  isConnected: boolean;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

export function NetworkSwitcher() {
  const [currentNetwork, setCurrentNetwork] = useState<string>('0x1');
  const [switching, setSwitching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const networks = Object.entries(WEB3_CONFIG.networks).map(([key, config]) => ({
    id: key,
    ...config
  }));

  const switchNetwork = async (chainId: string) => {
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask');
      return;
    }

    setSwitching(true);
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }]
      });
      setCurrentNetwork(chainId);
    } catch (error: any) {
      // If network doesn't exist, add it
      if (error.code === 4902) {
        try {
          const network = Object.values(WEB3_CONFIG.networks).find(
            n => n.chainId === chainId
          );
          if (network) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId,
                chainName: network.chainName,
                rpcUrls: [network.rpcUrl],
                blockExplorerUrls: [network.blockExplorer],
                nativeCurrency: network.nativeCurrency
              }]
            });
          }
        } catch (addError) {
          console.error('Error adding network:', addError);
        }
      }
    } finally {
      setSwitching(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Network Switcher</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {networks.map((network) => (
          <Button
            key={network.chainId}
            variant={currentNetwork === network.chainId ? 'default' : 'outline'}
            onClick={() => switchNetwork(network.chainId)}
            disabled={switching}
            className="w-full justify-start"
          >
            <div className="text-left">
              <p className="font-semibold">{network.chainName}</p>
              <p className="text-xs opacity-70">{network.nativeCurrency.symbol}</p>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
