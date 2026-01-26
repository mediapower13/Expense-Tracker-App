import { ethers } from 'ethers';

export interface ContractMethod {
  name: string;
  inputs: any[];
  outputs: any[];
  stateMutability: string;
}

export class SmartContractHelper {
  /**
   * Encode function call data
   */
  static encodeFunction(method: string, params: any[]): string {
    const iface = new ethers.Interface([`function ${method}`]);
    return iface.encodeFunctionData(method.split('(')[0], params);
  }

  /**
   * Decode function call data
   */
  static decodeFunction(data: string, abi: any[]): any {
    const iface = new ethers.Interface(abi);
    return iface.parseTransaction({ data });
  }

  /**
   * Batch encode multiple function calls for multicall
   */
  static batchEncodeFunctions(calls: Array<{ method: string; params: any[] }>): string[] {
    return calls.map(call => this.encodeFunction(call.method, call.params));
  }

  static async estimateGas(
    provider: ethers.Provider,
    contractAddress: string,
    method: string,
    params: any[]
  ): Promise<bigint> {
    const contract = new ethers.Contract(contractAddress, [], provider);
    return await contract[method].estimateGas(...params);
  }

  static validateAddress(address: string): boolean {
    return ethers.isAddress(address);
  }

  static formatEther(wei: bigint): string {
    return ethers.formatEther(wei);
  }

  static parseEther(ether: string): bigint {
    return ethers.parseEther(ether);
  }

  static async getContractCode(provider: ethers.Provider, address: string): Promise<string> {
    return await provider.getCode(address);
  }

  static isContract(code: string): boolean {
    return code !== '0x' && code.length > 2;
  }

  static generateSelector(functionSignature: string): string {
    return ethers.id(functionSignature).slice(0, 10);
  }

  static async simulateTransaction(
    provider: ethers.Provider,
    transaction: any
  ): Promise<string> {
    try {
      return await provider.call(transaction);
    } catch (error: any) {
      throw new Error(`Simulation failed: ${error.message}`);
    }
  }

  static parseEvents(receipt: ethers.TransactionReceipt, abi: any[]): any[] {
    const iface = new ethers.Interface(abi);
    return receipt.logs.map(log => {
      try {
        return iface.parseLog(log);
      } catch {
        return null;
      }
    }).filter(Boolean);
  }

  static async waitForConfirmations(
    provider: ethers.Provider,
    txHash: string,
    confirmations: number = 1
  ): Promise<ethers.TransactionReceipt | null> {
    const tx = await provider.getTransaction(txHash);
    if (!tx) return null;
    return await tx.wait(confirmations);
  }

  static async getTransactionStatus(
    provider: ethers.Provider,
    txHash: string
  ): Promise<{ confirmed: boolean; blockNumber?: number; status?: number }> {
    const receipt = await provider.getTransactionReceipt(txHash);
    if (!receipt) {
      return { confirmed: false };
    }
    return {
      confirmed: true,
      blockNumber: receipt.blockNumber,
      status: receipt.status
    };
  }

  static async getCurrentGasPrice(provider: ethers.Provider): Promise<bigint> {
    const feeData = await provider.getFeeData();
    return feeData.gasPrice || BigInt(0);
  }

  static calculateTransactionCost(gasUsed: bigint, gasPrice: bigint): bigint {
    return gasUsed * gasPrice;
  }

  static async getBlockTimestamp(provider: ethers.Provider, blockNumber: number): Promise<number> {
    const block = await provider.getBlock(blockNumber);
    return block ? block.timestamp : 0;
  }

  static encodeParameters(types: string[], values: any[]): string {
    return ethers.AbiCoder.defaultAbiCoder().encode(types, values);
  }

  static decodeParameters(types: string[], data: string): any {
    return ethers.AbiCoder.defaultAbiCoder().decode(types, data);
  }
}
