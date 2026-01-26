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
  const [walletType, setWalletType] = useState<string>('MetaMask');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    checkConnection();
    setupListeners();
  }, []);

  const checkConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Detect wallet type
        if (window.ethereum.isMetaMask) {
          setWalletType('MetaMask');
        } else if (window.ethereum.isCoinbaseWallet) {
          setWalletType('Coinbase Wallet');
        } else if (window.ethereum.isBraveWallet) {
          setWalletType('Brave Wallet');
        } else {
          setWalletType('Web3 Wallet');
        }

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

  const refreshBalance = async () => {
    if (!address) return;
    setIsRefreshing(true);
    try {
      await updateChainAndBalance(address);
    } catch (error) {
      console.error('Error refreshing balance:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const shortenAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(38)}`;
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setError('Address copied to clipboard!');
      setTimeout(() => setError(null), 2000);
    }
  };

  if (address) {
    return (
      <div className="flex items-center gap-4 p-4 border rounded-lg bg-card shadow-sm">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">Connected Wallet</p>
            <span className="px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded">
              {walletType}
            </span>
          </div>
          <p className="font-mono font-bold cursor-pointer hover:text-blue-600 transition-colors" onClick={copyAddress}>
            {shortenAddress(address)}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm font-semibold">{balance} ETH</p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={refreshBalance} 
              disabled={isRefreshing}
              className="h-6 px-2"
            >
              {isRefreshing ? '⟳' : '↻'}
            </Button>
          </div>
          {networkInfo && (
            <p className={`text-xs mt-1 flex items-center gap-1 ${networkInfo.isSupported ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
              <span className={`inline-block w-2 h-2 rounded-full ${networkInfo.isSupported ? 'bg-green-500' : 'bg-amber-500'}`}></span>
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
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-pulse">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
      <Button onClick={connectWallet} disabled={isConnecting} className="w-full">
        {isConnecting ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Connecting...
          </span>
        ) : (
          '🔐 Connect Wallet'
        )}
      </Button>
      <p className="text-xs text-center text-muted-foreground">
        Connect your wallet to access blockchain features
      </p>
    </div>
  );
}

export function WalletStatus() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ 
          method: 'eth_accounts' 
        });
        setConnected(accounts.length > 0);
        setAddress(accounts[0] || null);
      }
    };
    checkStatus();
  }, []);

  if (!connected) return null;

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
      <span className="text-muted-foreground">
        {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connected'}
      </span>
    </div>
  );
}
