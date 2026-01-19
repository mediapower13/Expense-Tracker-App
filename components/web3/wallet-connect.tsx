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

      const bal = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [account, 'latest']
      });
      const balanceInEth = (parseInt(bal, 16) / 1e18).toFixed(4);
      setBalance(balanceInEth);
    } catch (error) {
      console.error('Error updating chain and balance:', error);
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask to use this feature');
      return;
    }

    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      setAddress(accounts[0]);
      await updateChainAndBalance(accounts[0]);
    } catch (error) {
      console.error('Error connecting wallet:', error);
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
      <div className="flex items-center gap-4 p-4 border rounded-lg">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">Connected Wallet</p>
          <p className="font-mono font-bold">{shortenAddress(address)}</p>
          <p className="text-sm">{balance} ETH</p>
        </div>
        <Button variant="outline" onClick={disconnect}>
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={connectWallet} disabled={isConnecting}>
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </Button>
  );
}
