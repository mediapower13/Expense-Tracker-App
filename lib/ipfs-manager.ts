// IPFS utilities for NFT metadata storage
export class IPFSManager {
  private gateway: string;
  private apiKey?: string;

  constructor(gateway: string = 'https://ipfs.io/ipfs/', apiKey?: string) {
    this.gateway = gateway;
    this.apiKey = apiKey;
  }

  /**
   * Upload JSON metadata to IPFS
   */
  async uploadMetadata(metadata: any): Promise<string> {
    try {
      // In production, use Pinata, Infura, or other IPFS service
      // This is a mock implementation
      const jsonString = JSON.stringify(metadata, null, 2);
      const mockCID = `Qm${Math.random().toString(36).substring(2, 15)}`;
      
      console.log('Uploading metadata to IPFS:', metadata);
      console.log('Mock CID:', mockCID);
      
      return mockCID;
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      throw error;
    }
  }

  /**
   * Upload image to IPFS
   */
  async uploadImage(imageFile: File): Promise<string> {
    try {
      // Mock implementation
      const mockCID = `Qm${Math.random().toString(36).substring(2, 15)}`;
      console.log('Uploading image to IPFS:', imageFile.name);
      console.log('Mock CID:', mockCID);
      
      return mockCID;
    } catch (error) {
      console.error('Error uploading image to IPFS:', error);
      throw error;
    }
  }

  /**
   * Generate metadata URI
   */
  getMetadataURI(cid: string): string {
    return `${this.gateway}${cid}`;
  }

  /**
   * Fetch metadata from IPFS
   */
  async fetchMetadata(cid: string): Promise<any> {
    try {
      const uri = this.getMetadataURI(cid);
      const response = await fetch(uri);
      
      if (!response.ok) {
        throw new Error('Failed to fetch metadata');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching from IPFS:', error);
      throw error;
    }
  }

  /**
   * Generate NFT metadata for expense receipt
   */
  generateReceiptMetadata(
    amount: string,
    category: string,
    description: string,
    merchant: string,
    timestamp: number,
    transactionHash: string
  ): any {
    return {
      name: `Expense Receipt - ${category}`,
      description: `Receipt for ${description}`,
      image: '', // Will be set after image upload
      attributes: [
        {
          trait_type: 'Amount',
          value: amount
        },
        {
          trait_type: 'Category',
          value: category
        },
        {
          trait_type: 'Merchant',
          value: merchant
        },
        {
          trait_type: 'Date',
          display_type: 'date',
          value: timestamp
        },
        {
          trait_type: 'Transaction Hash',
          value: transactionHash
        }
      ],
      external_url: `https://expense-tracker.app/receipt/${transactionHash}`
    };
  }
}

// Export singleton instance
export const ipfsManager = new IPFSManager(
  process.env.NEXT_PUBLIC_IPFS_GATEWAY,
  process.env.IPFS_API_KEY
);
