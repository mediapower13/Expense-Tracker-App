import { ethers } from 'ethers';

export interface SecurityCheck {
  passed: boolean;
  level: 'critical' | 'warning' | 'info';
  message: string;
}

export class Web3Security {
  /**
   * Validate transaction for security issues
   */
  static validateTransaction(transaction: any): SecurityCheck[] {
    const checks: SecurityCheck[] = [];

    // Check if value is reasonable
    if (transaction.value && parseFloat(ethers.formatEther(transaction.value)) > 10) {
      checks.push({
        passed: false,
        level: 'warning',
        message: 'Transaction value exceeds 10 ETH. Please verify the amount.'
      });
    }

    // Check if recipient is valid
    if (!ethers.isAddress(transaction.to)) {
      checks.push({
        passed: false,
        level: 'critical',
        message: 'Invalid recipient address'
      });
    }

    // Check gas price
    if (transaction.gasPrice && transaction.gasPrice > ethers.parseUnits('500', 'gwei')) {
      checks.push({
        passed: false,
        level: 'warning',
        message: 'Gas price is unusually high'
      });
    }

    // Check for data in transaction
    if (transaction.data && transaction.data !== '0x') {
      checks.push({
        passed: true,
        level: 'info',
        message: 'Transaction contains contract interaction data'
      });
    }

    return checks;
  }

  static async checkContractSafety(
    provider: ethers.Provider,
    contractAddress: string
  ): Promise<SecurityCheck[]> {
    const checks: SecurityCheck[] = [];

    try {
      const code = await provider.getCode(contractAddress);
      
      if (code === '0x') {
        checks.push({
          passed: false,
          level: 'critical',
          message: 'Address is not a contract'
        });
      }

      // Basic bytecode analysis
      if (code.includes('selfdestruct')) {
        checks.push({
          passed: false,
          level: 'warning',
          message: 'Contract contains selfdestruct function'
        });
      }

    } catch (error) {
      checks.push({
        passed: false,
        level: 'critical',
        message: 'Failed to fetch contract code'
      });
    }

    return checks;
  }

  static sanitizeInput(input: string): string {
    return input.trim().replace(/[^\w\s.-]/gi, '');
  }

  static validateSignature(
    message: string,
    signature: string,
    expectedAddress: string
  ): boolean {
    try {
      const recoveredAddress = ethers.verifyMessage(message, signature);
      return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
    } catch {
      return false;
    }
  }

  static detectPhishing(url: string): SecurityCheck {
    const suspiciousPatterns = [
      /metamask.*\.(?!io)/i,
      /uniswap.*\.(?!org)/i,
      /opensea.*\.(?!io)/i
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(url)) {
        return {
          passed: false,
          level: 'critical',
          message: 'Potential phishing site detected'
        };
      }
    }

    return {
      passed: true,
      level: 'info',
      message: 'URL appears safe'
    };
  }

  static encryptPrivateData(data: string, password: string): string {
    // In production, use proper encryption library
    return Buffer.from(data).toString('base64');
  }

  static decryptPrivateData(encryptedData: string, password: string): string {
    // In production, use proper encryption library
    return Buffer.from(encryptedData, 'base64').toString('utf-8');
  }

  static generateNonce(): string {
    return ethers.hexlify(ethers.randomBytes(32));
  }

  static async verifyContractOwner(
    provider: ethers.Provider,
    contractAddress: string,
    expectedOwner: string
  ): Promise<boolean> {
    try {
      const contract = new ethers.Contract(
        contractAddress,
        ['function owner() view returns (address)'],
        provider
      );
      const owner = await contract.owner();
      return owner.toLowerCase() === expectedOwner.toLowerCase();
    } catch {
      return false;
    }
  }
}
