// React hooks for Web3 functionality
import { useState, useEffect, useCallback } from 'react';
import type { WalletState } from './wallet-types';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    chainId: null,
    balance: '0',
    isConnected: false,
    provider: null,
    signer: null
  });

  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkConnection = useCallback(async () => {
    if (typeof window.ethereum === 'undefined') return;

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        await updateWalletState(accounts[0]);
      }
    } catch (err) {
      console.error('Error checking connection:', err);
    }
  }, []);

  const updateWalletState = async (address: string) => {
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest']
      });

      const balanceInEth = (parseInt(balance, 16) / 1e18).toFixed(4);

      setWallet({
        address,
        chainId,
        balance: balanceInEth,
        isConnected: true,
        provider: window.ethereum,
        signer: null
      });
    } catch (err) {
      console.error('Error updating wallet state:', err);
    }
  };

  const connect = async () => {
    if (typeof window.ethereum === 'undefined') {
      setError('Please install MetaMask');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      await updateWalletState(accounts[0]);
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setWallet({
      address: null,
      chainId: null,
      balance: '0',
      isConnected: false,
      provider: null,
      signer: null
    });
  };

  useEffect(() => {
    checkConnection();

    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          updateWalletState(accounts[0]);
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (typeof window.ethereum !== 'undefined') {
        window.ethereum.removeAllListeners();
      }
    };
  }, [checkConnection]);

  return {
    wallet,
    isConnecting,
    error,
    connect,
    disconnect
  };
}
