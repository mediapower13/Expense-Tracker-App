import { ethers } from 'ethers';

export interface EventFilter {
  address?: string;
  topics?: string[];
  fromBlock?: number;
  toBlock?: number | 'latest';
}

export interface ParsedEvent {
  name: string;
  args: any;
  signature: string;
  blockNumber: number;
  transactionHash: string;
}

export class Web3Events {
  private provider: ethers.Provider;
  private listeners: Map<string, (event: any) => void> = new Map();

  constructor(provider: ethers.Provider) {
    this.provider = provider;
  }

  async getLogs(filter: EventFilter): Promise<ethers.Log[]> {
    return await this.provider.getLogs({
      address: filter.address,
      topics: filter.topics,
      fromBlock: filter.fromBlock || 0,
      toBlock: filter.toBlock || 'latest'
    });
  }

  parseLog(log: ethers.Log, abi: any[]): ParsedEvent | null {
    try {
      const iface = new ethers.Interface(abi);
      const parsed = iface.parseLog({
        topics: [...log.topics],
        data: log.data
      });

      if (!parsed) return null;

      return {
        name: parsed.name,
        args: parsed.args,
        signature: parsed.signature,
        blockNumber: log.blockNumber,
        transactionHash: log.transactionHash
      };
    } catch {
      return null;
    }
  }

  async getEventsBySignature(
    contractAddress: string,
    eventSignature: string,
    fromBlock: number = 0
  ): Promise<ethers.Log[]> {
    const topic = ethers.id(eventSignature);
    
    return await this.getLogs({
      address: contractAddress,
      topics: [topic],
      fromBlock,
      toBlock: 'latest'
    });
  }

  subscribe(
    contractAddress: string,
    eventName: string,
    abi: any[],
    callback: (event: ParsedEvent) => void
  ): void {
    const contract = new ethers.Contract(contractAddress, abi, this.provider);
    const key = `${contractAddress}-${eventName}`;

    const listener = (...args: any[]) => {
      const event = args[args.length - 1];
      callback({
        name: eventName,
        args: args.slice(0, -1),
        signature: '',
        blockNumber: event.blockNumber,
        transactionHash: event.transactionHash
      });
    };

    contract.on(eventName, listener);
    this.listeners.set(key, listener);
  }

  unsubscribe(contractAddress: string, eventName: string): void {
    const key = `${contractAddress}-${eventName}`;
    const listener = this.listeners.get(key);
    
    if (listener) {
      // Remove listener logic here
      this.listeners.delete(key);
    }
  }

  unsubscribeAll(): void {
    this.listeners.clear();
  }

  async waitForEvent(
    contractAddress: string,
    eventName: string,
    abi: any[],
    timeout: number = 60000
  ): Promise<ParsedEvent> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.unsubscribe(contractAddress, eventName);
        reject(new Error('Event wait timeout'));
      }, timeout);

      this.subscribe(contractAddress, eventName, abi, (event) => {
        clearTimeout(timer);
        this.unsubscribe(contractAddress, eventName);
        resolve(event);
      });
    });
  }

  static encodeEventTopic(eventSignature: string): string {
    return ethers.id(eventSignature);
  }

  static decodeEventData(data: string, types: string[]): any[] {
    return ethers.AbiCoder.defaultAbiCoder().decode(types, data);
  }
}
