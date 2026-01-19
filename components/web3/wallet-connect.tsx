'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { WalletType } from '@/lib/wallet-types';

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface NetworkInfo {
  name: string;
  chainId: string;
  isSupported: boolean;
}

export function WalletConnect() {
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [isConnecting, setIsConnecting] = useState(false);
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkConnection();
    setupListeners();
  }, []);

  const checkConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ 
          method: 'eth_accounts' 
        });
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          await updateChainAndBalance(accounts[0]);
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    }
  };

  const setupListeners = () => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnect();
    } else {
      setAddress(accounts[0]);
      updateChainAndBalance(accounts[0]);
    }
  };

  const handleChainChanged = () => {
    window.location.reload();
  };

  const updateChainAndBalance = async (account: string) => {
    try {
      const chain = await window.ethereum.request({ method: 'eth_chainId' });
      setChainId(chain);

      // Set network info
      const networks: Record<string, string> = {
        '0x1': 'Ethereum',
        '0x89': 'Polygon',
        '0x38': 'BSC',
        '0xa4b1': 'Arbitrum',
        '0xa': 'Optimism',
        '0xaa36a7': 'Sepolia'
      };

      setNetworkInfo({
        name: networks[chain] || 'Unknown',
        chainId: chain,
        isSupported: !!networks[chain]
      });

      const bal = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [account, 'latest']
      });
      const balanceInEth = (parseInt(bal, 16) / 1e18).toFixed(4);
      setBalance(balanceInEth);
      setError(null);
    } catch (error) {
      console.error('Error updating chain and balance:', error);
      setError('Failed to fetch wallet data');
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      setError('Please install MetaMask to use this feature');
      return;
    }

    setIsConnecting(true);
    setError(null);
    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      setAddress(accounts[0]);
      await updateChainAndBalance(accounts[0]);
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      setError(error.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAddress(null);
    setChainId(null);
    setBalance('0');
  };

  const shortenAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(38)}`;
  };

  if (address) {
    return (
      <div className="flex items-center gap-4 p-4 border rounded-lg bg-card">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">Connected Wallet</p>
          <p className="font-mono font-bold">{shortenAddress(address)}</p>
          <p className="text-sm">{balance} ETH</p>
          {networkInfo && (
            <p className={`text-xs mt-1 ${networkInfo.isSupported ? 'text-green-600' : 'text-amber-600'}`}>
              Network: {networkInfo.name}
            </p>
          )}
        </div>
        <Button variant="outline" onClick={disconnect}>
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
      <Button onClick={connectWallet} disabled={isConnecting}>
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </Button>
    </div>
  );
}
