# Blockchain Integration for Expense Tracker

## Overview

This expense tracker now includes full Web3 blockchain integration, allowing users to:

- Connect cryptocurrency wallets (MetaMask, WalletConnect, etc.)
- Track expenses on the blockchain
- Mint NFT receipts for transactions
- Make payments with ERC20 tokens
- View token balances across multiple chains
- Store expense data on smart contracts

## Smart Contracts

### ExpenseTracker.sol
Main contract for tracking expenses on-chain with budget management.

### NFTReceipt.sol
ERC721 contract for minting expense receipts as NFTs.

### TokenPayment.sol
Contract for processing payments with ERC20 tokens.

## Supported Networks

- Ethereum Mainnet
- Polygon (MATIC)
- BNB Smart Chain
- Sepolia Testnet (for development)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.blockchain .env.local
```

3. Compile contracts:
```bash
npm run compile
```

4. Deploy contracts:
```bash
# Local development
npm run deploy:local

# Sepolia testnet
npm run deploy:sepolia

# Polygon mainnet
npm run deploy:polygon
```

## Web3 Features

### Wallet Connection
Users can connect their Web3 wallets to the application.

### Blockchain Transactions
All expenses can be recorded on the blockchain for transparency and immutability.

### NFT Receipts
Each transaction can be minted as an NFT receipt with metadata.

### Token Payments
Support for payments in USDC, USDT, DAI, and other ERC20 tokens.

### Multi-Chain Support
Works across Ethereum, Polygon, and BSC networks.

## API Endpoints

- `GET /api/wallet` - Get wallet information
- `POST /api/wallet` - Connect/disconnect wallet
- `GET /api/blockchain/transactions` - Get blockchain transactions
- `POST /api/blockchain/transactions` - Create new transaction
- `GET /api/nft/receipts` - Get NFT receipts
- `POST /api/nft/receipts` - Mint new NFT receipt
- `GET /api/tokens/balances` - Get token balances
- `POST /api/blockchain/gas` - Estimate gas fees
- `GET /api/contracts` - Get smart contract data
- `POST /api/contracts` - Interact with contracts

## Components

### Web3 Components
- `WalletConnect` - Connect wallet button and status
- `TokenBalanceDisplay` - Show token balances
- `BlockchainTransactionList` - List blockchain transactions
- `NFTReceiptGallery` - Display NFT receipts
- `GasEstimator` - Estimate transaction costs
- `NetworkSwitcher` - Switch between networks

### React Hooks
- `useWallet` - Wallet connection management
- `useBlockchainTransactions` - Blockchain transaction operations
- `useNFTReceipts` - NFT receipt management
- `useTokenBalances` - Token balance tracking

## Security

- Private keys are never stored in the application
- All transactions require user approval via wallet
- Smart contracts are audited and verified
- Environment variables for sensitive data

## Gas Optimization

Contracts are optimized for minimal gas usage:
- Efficient storage patterns
- Batch operations where possible
- View functions for reading data

## Testing

Run contract tests:
```bash
npm run test
```

## License

MIT
