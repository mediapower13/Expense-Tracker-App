// Blockchain Utility Functions
import { ethers } from 'ethers';
import type { BlockchainTransaction, GasEstimate } from './wallet-types';

export class BlockchainUtils {
  /**
   * Format Wei to Ether
   */
  static formatEther(wei: string | bigint): string {
    try {
      return ethers.formatEther(wei);
    } catch (error) {
      console.error('Error formatting ether:', error);
      return '0';
    }
  }

  /**
   * Parse Ether to Wei
   */
  static parseEther(ether: string): bigint {
    try {
      return ethers.parseEther(ether);
    } catch (error) {
      console.error('Error parsing ether:', error);
      return BigInt(0);
    }
  }

  /**
   * Validate Ethereum address
   */
  static isValidAddress(address: string): boolean {
    try {
      return ethers.isAddress(address);
    } catch {
      return false;
    }
  }

  /**
   * Shorten address for display
   */
  static shortenAddress(address: string, chars = 4): string {
    if (!this.isValidAddress(address)) return '';
    return `${address.substring(0, chars + 2)}...${address.substring(42 - chars)}`;
  }

  /**
   * Calculate gas cost in USD
   */
  static async calculateGasCostUSD(
    gasUsed: string,
    gasPrice: string,
    ethPriceUSD: number
  ): Promise<number> {
    const gasCostEth = parseFloat(this.formatEther(
      BigInt(gasUsed) * BigInt(gasPrice)
    ));
    return gasCostEth * ethPriceUSD;
  }

  /**
   * Get transaction status from receipt
   */
  static getTransactionStatus(receipt: any): 'confirmed' | 'failed' {
    return receipt.status === 1 ? 'confirmed' : 'failed';
  }

  /**
   * Wait for transaction confirmation
   */
  static async waitForTransaction(
    provider: ethers.Provider,
    txHash: string,
    confirmations = 1
  ): Promise<any> {
    return await provider.waitForTransaction(txHash, confirmations);
  }

  /**
   * Estimate gas for transaction
   */
  static async estimateGas(
    provider: ethers.Provider,
    transaction: any
  ): Promise<GasEstimate> {
    try {
      const gasLimit = await provider.estimateGas(transaction);
      const feeData = await provider.getFeeData();
      
      const gasPrice = feeData.gasPrice || BigInt(0);
      const maxFeePerGas = feeData.maxFeePerGas;
      const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas;

      const estimatedCost = gasLimit * gasPrice;
      const estimatedCostETH = this.formatEther(estimatedCost);

      // Assume ETH price (in production, fetch from API)
      const ethPriceUSD = 2000;
      const estimatedCostUSD = parseFloat(estimatedCostETH) * ethPriceUSD;

      return {
        gasLimit: gasLimit.toString(),
        gasPrice: gasPrice.toString(),
        maxFeePerGas: maxFeePerGas?.toString(),
        maxPriorityFeePerGas: maxPriorityFeePerGas?.toString(),
        estimatedCostETH,
        estimatedCostUSD
      };
    } catch (error) {
      console.error('Error estimating gas:', error);
      throw error;
    }
  }

  /**
   * Convert timestamp to readable date
   */
  static formatTimestamp(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleString();
  }

  /**
   * Get block explorer URL
   */
  static getExplorerUrl(
    chainId: string,
    type: 'tx' | 'address' | 'token',
    value: string
  ): string {
    const explorers: Record<string, string> = {
      '0x1': 'https://etherscan.io',
      '0x89': 'https://polygonscan.com',
      '0x38': 'https://bscscan.com',
      '0xaa36a7': 'https://sepolia.etherscan.io'
    };

    const explorer = explorers[chainId] || explorers['0x1'];
    return `${explorer}/${type}/${value}`;
  }

  /**
   * Parse blockchain transaction to app format
   */
  static parseTransaction(tx: any, receipt?: any): Partial<BlockchainTransaction> {
    return {
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: this.formatEther(tx.value || 0),
      blockNumber: tx.blockNumber,
      timestamp: Math.floor(Date.now() / 1000),
      status: receipt ? this.getTransactionStatus(receipt) : 'pending',
      gasUsed: receipt?.gasUsed?.toString(),
      gasFee: receipt ? this.formatEther(
        BigInt(receipt.gasUsed) * BigInt(tx.gasPrice || 0)
      ) : undefined
    };
  }

  /**
   * Generate transaction ID
   */
  static generateTransactionId(hash: string, index: number = 0): string {
    return `${hash}-${index}`;
  }
}
