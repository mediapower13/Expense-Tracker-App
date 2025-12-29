// // Web3 service for contract interactions
// import { ethers } from 'ethers';
// import { EXPENSE_TRACKER_ABI, NFT_RECEIPT_ABI, TOKEN_PAYMENT_ABI } from './contract-abis';
// import { WEB3_CONFIG } from './web3-config';

// export class Web3Service {
//   private provider: ethers.BrowserProvider | null = null;
//   private signer: ethers.Signer | null = null;

//   /**
//    * Initialize provider and signer
//    */
//   async initialize() {
//     if (typeof window.ethereum === 'undefined') {
//       throw new Error('Web3 provider not found');
//     }

//     this.provider = new ethers.BrowserProvider(window.ethereum);
//     this.signer = await this.provider.getSigner();
//   }

//   /**
//    * Get ExpenseTracker contract instance
//    */
//   getExpenseTrackerContract() {
//     if (!this.signer) throw new Error('Signer not initialized');
    
//     const address = WEB3_CONFIG.contracts.expenseTracker;
//     if (!address) throw new Error('ExpenseTracker contract address not set');
    
//     return new ethers.Contract(address, EXPENSE_TRACKER_ABI, this.signer);
//   }

//   /**
//    * Get NFTReceipt contract instance
//    */
//   getNFTReceiptContract() {
//     if (!this.signer) throw new Error('Signer not initialized');
    
//     const address = WEB3_CONFIG.contracts.nftReceipt;
//     if (!address) throw new Error('NFTReceipt contract address not set');
    
//     return new ethers.Contract(address, NFT_RECEIPT_ABI, this.signer);
//   }

//   /**
//    * Get TokenPayment contract instance
//    */
//   getTokenPaymentContract() {
//     if (!this.signer) throw new Error('Signer not initialized');
    
//     const address = WEB3_CONFIG.contracts.tokenPayment;
//     if (!address) throw new Error('TokenPayment contract address not set');
    
//     return new ethers.Contract(address, TOKEN_PAYMENT_ABI, this.signer);
//   }

//   /**
//    * Add expense to smart contract
//    */
//   async addExpense(
//     amount: string,
//     category: string,
//     description: string,
//     isRecurring: boolean = false,
//     recurringInterval: number = 0
//   ) {
//     const contract = this.getExpenseTrackerContract();
//     const amountWei = ethers.parseEther(amount);
    
//     const tx = await contract.addExpense(
//       amountWei,
//       category,
//       description,
//       isRecurring,
//       recurringInterval
//     );
    
//     return await tx.wait();
//   }

//   /**
//    * Set monthly budget
//    */
//   async setBudget(monthlyLimit: string) {
//     const contract = this.getExpenseTrackerContract();
//     const limitWei = ethers.parseEther(monthlyLimit);
    
//     const tx = await contract.setBudget(limitWei);
//     return await tx.wait();
//   }

//   /**
//    * Get all expenses from contract
//    */
//   async getExpenses() {
//     const contract = this.getExpenseTrackerContract();
//     return await contract.getExpenses();
//   }

//   /**
//    * Get budget information
//    */
//   async getBudget() {
//     const contract = this.getExpenseTrackerContract();
//     return await contract.getBudget();
//   }

//   /**
//    * Mint NFT receipt
//    */
//   async mintNFTReceipt(
//     to: string,
//     amount: string,
//     category: string,
//     description: string,
//     merchant: string,
//     transactionHash: string,
//     metadataURI: string
//   ) {
//     const contract = this.getNFTReceiptContract();
//     const amountWei = ethers.parseEther(amount);
    
//     const tx = await contract.mintReceipt(
//       to,
//       amountWei,
//       category,
//       description,
//       merchant,
//       transactionHash,
//       metadataURI
//     );
    
//     return await tx.wait();
//   }

//   /**
//    * Get NFT receipt data
//    */
//   async getNFTReceiptData(tokenId: string) {
//     const contract = this.getNFTReceiptContract();
//     return await contract.getReceiptData(tokenId);
//   }

//   /**
//    * Process token payment
//    */
//   async processTokenPayment(
//     tokenAddress: string,
//     amount: string,
//     purpose: string
//   ) {
//     const contract = this.getTokenPaymentContract();
//     const amountWei = ethers.parseEther(amount);
    
//     const tx = await contract.processPayment(
//       tokenAddress,
//       amountWei,
//       purpose
//     );
    
//     return await tx.wait();
//   }
// }

// // Export singleton instance
// export const web3Service = new Web3Service();
