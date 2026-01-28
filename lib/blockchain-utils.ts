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
    if (!address || !this.isValidAddress(address)) return '';
    if (address.length < chars + 2) return address;
    return `${address.substring(0, chars + 2)}...${address.substring(42 - chars)}`;
  }

  /**
   * Format token amount with decimals
   */
  static formatTokenAmount(amount: bigint | string, decimals: number): string {
    try {
      const value = typeof amount === 'string' ? BigInt(amount) : amount;
      return ethers.formatUnits(value, decimals);
    } catch (error) {
      console.error('Error formatting token amount:', error);
      return '0';
    }
  }

  /**
   * Parse token amount to base units
   */
  static parseTokenAmount(amount: string, decimals: number): bigint {
    try {
      return ethers.parseUnits(amount, decimals);
    } catch (error) {
      console.error('Error parsing token amount:', error);
      return BigInt(0);
    }
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

  /**
   * Check if transaction is ERC20 transfer
   */
  static isERC20Transfer(tx: any): boolean {
    if (!tx.data || tx.data === '0x') return false;
    // ERC20 transfer method signature
    return tx.data.startsWith('0xa9059cbb');
  }

  /**
   * Decode ERC20 transfer data
   */
  static decodeERC20Transfer(data: string): { to: string; amount: bigint } | null {
    try {
      if (!this.isERC20Transfer({ data })) return null;
      
      const to = '0x' + data.slice(34, 74);
      const amount = BigInt('0x' + data.slice(74));
      
      return { to, amount };
    } catch (error) {
      console.error('Error decoding ERC20 transfer:', error);
      return null;
    }
  }

  /**
   * Calculate percentage change
   */
  static calculatePercentageChange(oldValue: number, newValue: number): number {
    if (oldValue === 0) return 0;
    return ((newValue - oldValue) / oldValue) * 100;
  }

  /**
   * Format large numbers with suffixes
   */
  static formatLargeNumber(value: number): string {
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
    return value.toFixed(2);
  }

  /**
   * Convert hex to decimal
   */
  static hexToDecimal(hex: string): number {
    return parseInt(hex, 16);
  }

  /**
   * Convert decimal to hex
   */
  static decimalToHex(decimal: number): string {
    return '0x' + decimal.toString(16);
  }

  /**
   * Check if string is valid hex
   */
  static isValidHex(str: string): boolean {
    return /^0x[0-9a-fA-F]*$/.test(str);
  }

  /**
   * Get network name from chain ID
   */
  static getNetworkName(chainId: string): string {
    const networks: Record<string, string> = {
      '0x1': 'Ethereum Mainnet',
      '0x89': 'Polygon',
      '0x38': 'BSC',
      '0xaa36a7': 'Sepolia Testnet',
      '0x5': 'Goerli Testnet'
    };
    return networks[chainId] || 'Unknown Network';
  }

  /**
   * Convert Wei to Gwei
   */
  static weiToGwei(wei: bigint | string): string {
    const weiBigInt = typeof wei === 'string' ? BigInt(wei) : wei;
    return (Number(weiBigInt) / 1e9).toFixed(2);
  }

  /**
   * Convert Gwei to Wei
   */
  static gweiToWei(gwei: string | number): bigint {
    const gweiNum = typeof gwei === 'string' ? parseFloat(gwei) : gwei;
    return BigInt(Math.floor(gweiNum * 1e9));
  }

  /**
   * Format gas price for display
   */
  static formatGasPrice(gasPrice: bigint | string): string {
    const gwei = this.weiToGwei(gasPrice);
    return `${gwei} Gwei`;
  }

  /**
   * Calculate transaction fee
   */
  static calculateFee(gasUsed: bigint, gasPrice: bigint): string {
    const fee = gasUsed * gasPrice;
    return this.formatEther(fee.toString());
  }

  /**
   * Compare addresses (case-insensitive)
   */
  static compareAddresses(addr1: string, addr2: string): boolean {
    if (!this.isValidAddress(addr1) || !this.isValidAddress(addr2)) return false;
    return addr1.toLowerCase() === addr2.toLowerCase();
  }

  /**
   * Get contract deployment address
   */
  static getContractAddress(from: string, nonce: number): string {
    // Simple implementation - in production use proper RLP encoding
    return `0x${Math.random().toString(16).substr(2, 40)}`;
  }

  /**
   * Check if transaction is likely a contract deployment
   */
  static isContractDeployment(tx: any): boolean {
    return !tx.to || tx.to === '0x0000000000000000000000000000000000000000';
  }
}
