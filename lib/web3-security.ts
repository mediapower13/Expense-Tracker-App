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
    if (!input || typeof input !== 'string') return '';
    // Remove potentially dangerous characters while preserving alphanumeric, spaces, dots, and hyphens
    return input.trim().replace(/[^\w\s.-]/gi, '').substring(0, 1000);
  }

  static sanitizeAddress(address: string): string {
    if (!address || typeof address !== 'string') return '';
    // Ensure address starts with 0x and contains only valid hex characters
    const cleaned = address.trim().toLowerCase();
    if (!/^0x[a-f0-9]{40}$/i.test(cleaned)) {
      throw new Error('Invalid address format');
    }
    return cleaned;
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

  static validateAmount(amount: string, maxAmount?: string): SecurityCheck {
    try {
      const value = parseFloat(amount);
      
      if (value <= 0) {
        return {
          passed: false,
          level: 'critical',
          message: 'Amount must be greater than 0'
        };
      }

      if (maxAmount && value > parseFloat(maxAmount)) {
        return {
          passed: false,
          level: 'critical',
          message: 'Amount exceeds maximum allowed'
        };
      }

      return {
        passed: true,
        level: 'info',
        message: 'Amount is valid'
      };
    } catch {
      return {
        passed: false,
        level: 'critical',
        message: 'Invalid amount format'
      };
    }
  }

  static checkTransactionRateLimit(
    recentTransactions: number,
    timeWindow: number,
    maxTransactions: number
  ): SecurityCheck {
    if (recentTransactions >= maxTransactions) {
      return {
        passed: false,
        level: 'warning',
        message: `Too many transactions in ${timeWindow}ms. Please wait.`
      };
    }

    return {
      passed: true,
      level: 'info',
      message: 'Rate limit check passed'
    };
  }

  static validateChainId(chainId: string, allowedChains: string[]): SecurityCheck {
    if (!allowedChains.includes(chainId)) {
      return {
        passed: false,
        level: 'warning',
        message: 'Connected to unsupported network'
      };
    }

    return {
      passed: true,
      level: 'info',
      message: 'Chain ID is supported'
    };
  }

  static validateTokenAddress(address: string, knownTokens: string[]): SecurityCheck {
    if (!ethers.isAddress(address)) {
      return {
        passed: false,
        level: 'critical',
        message: 'Invalid token address'
      };
    }

    if (!knownTokens.includes(address.toLowerCase())) {
      return {
        passed: false,
        level: 'warning',
        message: 'Unknown token - proceed with caution'
      };
    }

    return {
      passed: true,
      level: 'info',
      message: 'Token address verified'
    };
  }

  static checkContractInteraction(to: string, data: string): SecurityCheck {
    if (data && data !== '0x' && data.length > 10) {
      return {
        passed: true,
        level: 'info',
        message: 'Contract interaction detected - review carefully'
      };
    }

    return {
      passed: true,
      level: 'info',
      message: 'Simple transfer'
    };
  }

  static validateNonce(nonce: number, expectedNonce: number): SecurityCheck {
    if (nonce < expectedNonce) {
      return {
        passed: false,
        level: 'critical',
        message: 'Nonce is too low - transaction will fail'
      };
    }

    if (nonce > expectedNonce + 5) {
      return {
        passed: false,
        level: 'warning',
        message: 'Nonce is unusually high - check pending transactions'
      };
    }

    return {
      passed: true,
      level: 'info',
      message: 'Nonce is valid'
    };
  }
}
