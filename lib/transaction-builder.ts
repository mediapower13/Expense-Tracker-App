import { ethers } from 'ethers';

export interface TransactionParams {
  to: string;
  value?: bigint;
  data?: string;
  gasLimit?: bigint;
  gasPrice?: bigint;
  nonce?: number;
}

export class TransactionBuilder {
  private params: Partial<TransactionParams> = {};

  setRecipient(address: string): this {
    if (!ethers.isAddress(address)) {
      throw new Error('Invalid recipient address');
    }
    this.params.to = address;
    return this;
  }

  setValue(amount: string): this {
    this.params.value = ethers.parseEther(amount);
    return this;
  }

  setData(data: string): this {
    this.params.data = data;
    return this;
  }

  setGasLimit(limit: number): this {
    this.params.gasLimit = BigInt(limit);
    return this;
  }

  setGasPrice(price: string): this {
    this.params.gasPrice = ethers.parseUnits(price, 'gwei');
    return this;
  }

  setNonce(nonce: number): this {
    this.params.nonce = nonce;
    return this;
  }

  async estimateGas(provider: ethers.Provider): Promise<bigint> {
    if (!this.params.to) {
      throw new Error('Recipient address is required');
    }

    return await provider.estimateGas({
      to: this.params.to,
      value: this.params.value || 0n,
      data: this.params.data || '0x'
    });
  }

  build(): TransactionParams {
    if (!this.params.to) {
      throw new Error('Recipient address is required');
    }

    return {
      to: this.params.to,
      value: this.params.value || 0n,
      data: this.params.data || '0x',
      gasLimit: this.params.gasLimit,
      gasPrice: this.params.gasPrice,
      nonce: this.params.nonce
    };
  }

  async buildAndEstimate(provider: ethers.Provider): Promise<TransactionParams> {
    const tx = this.build();
    
    if (!tx.gasLimit) {
      tx.gasLimit = await this.estimateGas(provider);
    }

    if (!tx.gasPrice) {
      const feeData = await provider.getFeeData();
      tx.gasPrice = feeData.gasPrice || 0n;
    }

    return tx;
  }

  reset(): this {
    this.params = {};
    return this;
  }

  static createERC20Transfer(tokenAddress: string, to: string, amount: string): TransactionBuilder {
    const iface = new ethers.Interface([
      'function transfer(address to, uint256 amount) returns (bool)'
    ]);
    
    const data = iface.encodeFunctionData('transfer', [to, ethers.parseEther(amount)]);
    
    return new TransactionBuilder()
      .setRecipient(tokenAddress)
      .setData(data);
  }

  static createERC721Transfer(
    nftAddress: string,
    from: string,
    to: string,
    tokenId: number
  ): TransactionBuilder {
    const iface = new ethers.Interface([
      'function transferFrom(address from, address to, uint256 tokenId)'
    ]);
    
    const data = iface.encodeFunctionData('transferFrom', [from, to, tokenId]);
    
    return new TransactionBuilder()
      .setRecipient(nftAddress)
      .setData(data);
  }

  static createERC20Approval(
    tokenAddress: string,
    spender: string,
    amount: string
  ): TransactionBuilder {
    const iface = new ethers.Interface([
      'function approve(address spender, uint256 amount) returns (bool)'
    ]);
    
    const data = iface.encodeFunctionData('approve', [spender, ethers.parseEther(amount)]);
    
    return new TransactionBuilder()
      .setRecipient(tokenAddress)
      .setData(data);
  }

  static createContractCall(
    contractAddress: string,
    abi: string[],
    functionName: string,
    params: any[]
  ): TransactionBuilder {
    const iface = new ethers.Interface(abi);
    const data = iface.encodeFunctionData(functionName, params);
    
    return new TransactionBuilder()
      .setRecipient(contractAddress)
      .setData(data);
  }

  clone(): TransactionBuilder {
    const builder = new TransactionBuilder();
    builder.params = { ...this.params };
    return builder;
  }

  getParams(): Partial<TransactionParams> {
    return { ...this.params };
  }

  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.params.to) {
      errors.push('Recipient address is required');
    } else if (!ethers.isAddress(this.params.to)) {
      errors.push('Invalid recipient address');
    }

    if (this.params.value && this.params.value < 0n) {
      errors.push('Value cannot be negative');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
