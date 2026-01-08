// Web3 service for contract interactions
import { ethers } from 'ethers';
import { EXPENSE_TRACKER_ABI, NFT_RECEIPT_ABI, TOKEN_PAYMENT_ABI } from './contract-abis';
import { WEB3_CONFIG } from './web3-config';

// Type declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

export class Web3Service {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;

  /**
   * Initialize provider and signer
   */
  async initialize(): Promise<void> {
    if (typeof window === 'undefined') {
      throw new Error('Window object not available');
    }
    
    if (!window.ethereum) {
      throw new Error('Web3 provider not found. Please install MetaMask or another Web3 wallet.');
    }

    try {
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      
      // Validate network
      const network = await this.provider.getNetwork();
      const supportedChainIds = Object.values(WEB3_CONFIG.networks).map(n => n.chainId);
      if (!supportedChainIds.includes('0x' + network.chainId.toString(16))) {
        console.warn(`Connected to unsupported network: ${network.chainId}`);
      }
    } catch (error) {
      console.error('Web3 initialization error:', error);
      throw new Error(`Failed to initialize Web3: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Check if the service is initialized
   */
  private ensureInitialized(): void {
    if (!this.signer || !this.provider) {
      throw new Error('Web3Service not initialized. Call initialize() first.');
    }
  }

  /**
   * Check if wallet is connected
   */
  isConnected(): boolean {
    return this.provider !== null && this.signer !== null;
  }

  /**
   * Disconnect wallet
   */
  disconnect(): void {
    this.provider = null;
    this.signer = null;
  }

  /**
   * Get current connected account address
   */
  async getCurrentAccount(): Promise<string | null> {
    if (!this.signer) return null;
    try {
      return await this.signer.getAddress();
    } catch (error) {
      console.error('Error getting current account:', error);
      return null;
    }
  }

  /**
   * Get current network information
   */
  async getNetwork(): Promise<any> {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }
    return await this.provider.getNetwork();
  }

  /**
   * Get account balance in ETH
   * @param address - Optional address to get balance for. If not provided, uses current account
   * @returns Balance in ETH as a string
   */
  async getBalance(address?: string): Promise<string> {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }
    const addr = address || await this.getCurrentAccount();
    if (!addr) throw new Error('No account address available');
    
    const balance = await this.provider.getBalance(addr);
    return ethers.formatEther(balance);
  }

  /**
   * Setup event listeners for account and network changes
   */
  setupEventListeners(
    onAccountChanged?: (accounts: string[]) => void,
    onChainChanged?: (chainId: string) => void
  ): void {
    if (typeof window === 'undefined' || !window.ethereum) {
      console.warn('Cannot setup event listeners: window.ethereum not available');
      return;
    }

    if (onAccountChanged) {
      window.ethereum.on('accountsChanged', onAccountChanged);
    }
    
    if (onChainChanged) {
      window.ethereum.on('chainChanged', onChainChanged);
    }
  }

  /**
   * Get ExpenseTracker contract instance
   */
  getExpenseTrackerContract(): ethers.Contract {
    this.ensureInitialized();
    
    const address = WEB3_CONFIG.contracts.expenseTracker;
    if (!address) throw new Error('ExpenseTracker contract address not set');
    
    return new ethers.Contract(address, EXPENSE_TRACKER_ABI, this.signer!);
  }

  /**
   * Get NFTReceipt contract instance
   */
  getNFTReceiptContract(): ethers.Contract {
    this.ensureInitialized();
    
    const address = WEB3_CONFIG.contracts.nftReceipt;
    if (!address) throw new Error('NFTReceipt contract address not set');
    
    return new ethers.Contract(address, NFT_RECEIPT_ABI, this.signer!);
  }

  /**
   * Get TokenPayment contract instance
   */
  getTokenPaymentContract(): ethers.Contract {
    this.ensureInitialized();
    
    const address = WEB3_CONFIG.contracts.tokenPayment;
    if (!address) throw new Error('TokenPayment contract address not set');
    
    return new ethers.Contract(address, TOKEN_PAYMENT_ABI, this.signer!);
  }

  /**
   * Add expense to smart contract
   */
  async addExpense(
    amount: string,
    category: string,
    description: string,
    isRecurring: boolean = false,
    recurringInterval: number = 0
  ): Promise<any> {
    try {
      const contract = this.getExpenseTrackerContract();
      const amountWei = ethers.parseEther(amount);
      
      const tx = await contract.addExpense(
        amountWei,
        category,
        description,
        isRecurring,
        recurringInterval
      );
      
      return await tx.wait();
    } catch (error) {
      throw new Error(`Failed to add expense: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Set monthly budget
   */
  async setBudget(monthlyLimit: string): Promise<any> {
    try {
      const contract = this.getExpenseTrackerContract();
      const limitWei = ethers.parseEther(monthlyLimit);
      
      const tx = await contract.setBudget(limitWei);
      return await tx.wait();
    } catch (error) {
      throw new Error(`Failed to set budget: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get all expenses from contract
   */
  async getExpenses(): Promise<any[]> {
    try {
      const contract = this.getExpenseTrackerContract();
      return await contract.getExpenses();
    } catch (error) {
      throw new Error(`Failed to get expenses: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get budget information
   */
  async getBudget(): Promise<any> {
    try {
      const contract = this.getExpenseTrackerContract();
      return await contract.getBudget();
    } catch (error) {
      throw new Error(`Failed to get budget: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Mint NFT receipt
   */
  async mintNFTReceipt(
    to: string,
    amount: string,
    category: string,
    description: string,
    merchant: string,
    transactionHash: string,
    metadataURI: string
  ): Promise<any> {
    try {
      const contract = this.getNFTReceiptContract();
      const amountWei = ethers.parseEther(amount);
      
      const tx = await contract.mintReceipt(
        to,
        amountWei,
        category,
        description,
        merchant,
        transactionHash,
        metadataURI
      );
      
      return await tx.wait();
    } catch (error) {
      throw new Error(`Failed to mint NFT receipt: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get NFT receipt data
   */
  async getNFTReceiptData(tokenId: string): Promise<any> {
    try {
      const contract = this.getNFTReceiptContract();
      return await contract.getReceiptData(tokenId);
    } catch (error) {
      throw new Error(`Failed to get NFT receipt data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Process token payment
   */
  async processTokenPayment(
    tokenAddress: string,
    amount: string,
    purpose: string
  ): Promise<any> {
    try {
      const contract = this.getTokenPaymentContract();
      const amountWei = ethers.parseEther(amount);
      
      const tx = await contract.processPayment(
        tokenAddress,
        amountWei,
        purpose
      );
      
      return await tx.wait();
    } catch (error) {
      throw new Error(`Failed to process token payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get transaction receipt and status
   */
  async getTransactionStatus(txHash: string): Promise<any> {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }
    try {
      const receipt = await this.provider.getTransactionReceipt(txHash);
      return receipt;
    } catch (error) {
      console.error('Error getting transaction status:', error);
      throw error;
    }
  }

  /**
   * Estimate gas for a transaction
   */
  async estimateGas(transaction: any): Promise<bigint> {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }
    try {
      return await this.provider.estimateGas(transaction);
    } catch (error) {
      console.error('Error estimating gas:', error);
      throw error;
    }
  }

  /**
   * Retry a failed transaction with higher gas
   */
  async retryTransaction(txHash: string, gasMultiplier: number = 1.2): Promise<any> {
    this.ensureInitialized();
    try {
      const tx = await this.provider!.getTransaction(txHash);
      if (!tx) throw new Error('Transaction not found');
      
      // Increase gas price by multiplier
      const newGasPrice = tx.gasPrice ? (tx.gasPrice * BigInt(Math.floor(gasMultiplier * 100))) / BigInt(100) : undefined;
      
      const newTx = {
        to: tx.to,
        from: tx.from,
        value: tx.value,
        data: tx.data,
        gasPrice: newGasPrice,
        gasLimit: tx.gasLimit,
        nonce: tx.nonce, // Preserve nonce to replace the stuck transaction
      };
      
      return await this.signer!.sendTransaction(newTx);
    } catch (error) {
      console.error('Error retrying transaction:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const web3Service = new Web3Service();
