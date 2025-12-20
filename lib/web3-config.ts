// Web3 Configuration for Blockchain Integration
export const WEB3_CONFIG = {
  // Supported Networks
  networks: {
    ethereum: {
      chainId: '0x1',
      chainName: 'Ethereum Mainnet',
      rpcUrl: 'https://mainnet.infura.io/v3/',
      blockExplorer: 'https://etherscan.io',
      nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }
    },
    polygon: {
      chainId: '0x89',
      chainName: 'Polygon Mainnet',
      rpcUrl: 'https://polygon-rpc.com',
      blockExplorer: 'https://polygonscan.com',
      nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 }
    },
    bsc: {
      chainId: '0x38',
      chainName: 'BNB Smart Chain',
      rpcUrl: 'https://bsc-dataseed.binance.org',
      blockExplorer: 'https://bscscan.com',
      nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 }
    },
    sepolia: {
      chainId: '0xaa36a7',
      chainName: 'Sepolia Testnet',
      rpcUrl: 'https://sepolia.infura.io/v3/',
      blockExplorer: 'https://sepolia.etherscan.io',
      nativeCurrency: { name: 'Sepolia ETH', symbol: 'ETH', decimals: 18 }
    }
  },

  // Contract Addresses (to be deployed)
  contracts: {
    expenseTracker: process.env.NEXT_PUBLIC_EXPENSE_TRACKER_CONTRACT || '',
    tokenPayment: process.env.NEXT_PUBLIC_TOKEN_PAYMENT_CONTRACT || '',
    nftReceipt: process.env.NEXT_PUBLIC_NFT_RECEIPT_CONTRACT || ''
  },

  // Supported Tokens
  tokens: {
    USDC: {
      ethereum: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      polygon: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      bsc: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d'
    },
    USDT: {
      ethereum: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      polygon: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      bsc: '0x55d398326f99059fF775485246999027B3197955'
    },
    DAI: {
      ethereum: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      polygon: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
      bsc: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3'
    }
  }
};

export const DEFAULT_NETWORK = 'polygon';
export const DEFAULT_TOKEN = 'USDC';
