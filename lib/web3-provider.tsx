// Web3 Context Provider
'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useWallet } from './hooks/use-wallet';
import type { WalletState } from './wallet-types';

interface Web3ContextType {
  wallet: WalletState;
  isConnecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({ children }: { children: ReactNode }) {
  const walletState = useWallet();

  return (
    <Web3Context.Provider value={walletState}>
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}

export function useWeb3Safe() {
  try {
    return useWeb3();
  } catch {
    return null;
  }
}

export function Web3Guard({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  const web3 = useWeb3Safe();

  if (!web3 || !web3.wallet.isConnected) {
    return <>{fallback || <div>Please connect your wallet</div>}</>;
  }

  return <>{children}</>;
}
