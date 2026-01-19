// Wallet and Blockchain Types

export interface WalletState {
  address: string | null;
  chainId: string | null;
  balance: string;
  isConnected: boolean;
  provider: any;
  signer: any;
  ensName?: string | null;
  avatar?: string | null;
}

export interface BlockchainTransaction {
  id: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  token?: string;
  timestamp: number;
  blockNumber: number;
  status: 'pending' | 'confirmed' | 'failed';
  gasUsed?: string;
  gasFee?: string;
  type: 'expense' | 'income' | 'transfer';
  category?: string;
  description?: string;
  nftReceiptId?: string;
}

export interface TokenBalance {
  symbol: string;
  name: string;
  balance: string;
  decimals: number;
  address: string;
  valueUSD?: number;
}

export interface NFTReceipt {
  tokenId: string;
  transactionHash: string;
  metadata: {
    amount: string;
    category: string;
    description: string;
    timestamp: number;
    merchant?: string;
  };
  imageUrl?: string;
}

export interface SmartContractExpense {
  id: string;
  amount: string;
  token: string;
  category: string;
  description: string;
  timestamp: number;
  creator: string;
  isRecurring: boolean;
  recurringInterval?: number;
}

export interface WalletConnectionOptions {
  autoConnect?: boolean;
  preferredNetwork?: string;
  cacheProvider?: boolean;
}

export enum WalletType {
  METAMASK = 'metamask',
  WALLETCONNECT = 'walletconnect',
  COINBASE = 'coinbase',
  TRUST = 'trust'
}

export interface GasEstimate {
  gasLimit: string;
  gasPrice: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
  estimatedCostETH: string;
  estimatedCostUSD: number;
}
