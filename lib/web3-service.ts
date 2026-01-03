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
}

// Export singleton instance
export const web3Service = new Web3Service();
