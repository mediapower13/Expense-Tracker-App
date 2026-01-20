'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { WEB3_CONFIG } from '@/lib/web3-config';

interface Network {
  chainId: string;
  chainName: string;
  isConnected: boolean;
  icon?: string;
  color?: string;
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
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const networkIcons: Record<string, { icon: string; color: string }> = {
    '0x1': { icon: '🔷', color: 'text-blue-500' },
    '0x89': { icon: '🟣', color: 'text-purple-500' },
    '0x38': { icon: '🟡', color: 'text-yellow-500' },
    '0xa4b1': { icon: '🔵', color: 'text-blue-400' },
    '0xa': { icon: '🔴', color: 'text-red-500' },
    '0xaa36a7': { icon: '🔸', color: 'text-orange-500' }
  };

  useEffect(() => {
    checkWalletConnection();
    setupListeners();
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        setIsWalletConnected(accounts.length > 0);
        if (accounts.length > 0) {
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          setCurrentNetwork(chainId);
        }
      } catch (error) {
        console.error('Error checking wallet:', error);
      }
    }
  };

  const setupListeners = () => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('chainChanged', (chainId: string) => {
        setCurrentNetwork(chainId);
        setError(null);
      });
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setIsWalletConnected(accounts.length > 0);
      });
    }
  };

  const networks = Object.entries(WEB3_CONFIG.networks).map(([key, config]) => ({
    id: key,
    ...config
  }));

  const switchNetwork = async (chainId: string) => {
    if (typeof window.ethereum === 'undefined') {
      setError('Please install MetaMask or another Web3 wallet');
      return;
    }

    if (!isWalletConnected) {
      setError('Please connect your wallet first');
      return;
    }

    setSwitching(true);
    setError(null);
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
            setCurrentNetwork(chainId);
          }
        } catch (addError: any) {
          console.error('Error adding network:', addError);
          setError(addError.message || 'Failed to add network');
        }
      } else {
        setError(error.message || 'Failed to switch network');
      }
    } finally {
      setSwitching(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">🌐 Network Switcher</h3>
        {currentNetwork && networkIcons[currentNetwork] && (
          <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full">
            <span className={`text-xl ${networkIcons[currentNetwork].color}`}>
              {networkIcons[currentNetwork].icon}
            </span>
            <span className="text-sm font-semibold">
              {networks.find(n => n.chainId === currentNetwork)?.chainName || 'Unknown'}
            </span>
          </div>
        )}
      </div>

      {!isWalletConnected && (
        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <p className="text-sm text-amber-700 dark:text-amber-400">
            ⚠️ Please connect your wallet to switch networks
          </p>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {networks.map((network) => {
          const isActive = currentNetwork === network.chainId;
          const networkIcon = networkIcons[network.chainId];
          
          return (
            <Button
              key={network.chainId}
              variant={isActive ? 'default' : 'outline'}
              onClick={() => switchNetwork(network.chainId)}
              disabled={switching || !isWalletConnected}
              className="w-full justify-start h-auto py-3"
            >
              <div className="flex items-center gap-3 w-full">
                {networkIcon && (
                  <span className={`text-2xl ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                    {networkIcon.icon}
                  </span>
                )}
                <div className="text-left flex-1">
                  <p className="font-semibold">{network.chainName}</p>
                  <p className="text-xs opacity-70">{network.nativeCurrency.symbol}</p>
                </div>
                {isActive && (
                  <span className="text-green-500 text-xl">✓</span>
                )}
              </div>
            </Button>
          );
        })}
      </div>
      
      <div className="pt-3 border-t text-xs text-muted-foreground text-center">
        <p>💡 Switching networks may require confirmation in your wallet</p>
      </div>
    </div>
  );
}
