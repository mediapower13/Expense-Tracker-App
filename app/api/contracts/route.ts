import { NextResponse } from 'next/server';

// GET: Fetch smart contract data
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  const contract = searchParams.get('contract');

  if (!address) {
    return NextResponse.json(
      { error: 'Address is required' },
      { status: 400 }
    );
  }

  try {
    // Mock smart contract data
    const contractData = {
      expenseTracker: {
        totalExpenses: '2547.89',
        expenseCount: 42,
        budget: {
          monthlyLimit: '3000.00',
          currentSpent: '1247.50',
          remaining: '1752.50'
        },
        recentExpenses: [
          {
            id: 0,
            amount: '50.00',
            category: 'Food',
            description: 'Groceries',
            timestamp: Date.now() / 1000
          }
        ]
      },
      tokenPayment: {
        supportedTokens: ['USDC', 'USDT', 'DAI'],
        paymentCount: 15,
        totalVolume: '5000.00'
      },
      nftReceipt: {
        mintedCount: 8,
        receipts: []
      }
    };

    return NextResponse.json(contractData[contract as keyof typeof contractData] || {});
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch contract data' },
      { status: 500 }
    );
  }
}

// POST: Interact with smart contract
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { contract, method, params } = body;

    if (!contract || !method) {
      return NextResponse.json(
        { error: 'Contract and method are required' },
        { status: 400 }
      );
    }

    // Mock contract interaction
    const result = {
      success: true,
      transactionHash: `0x${Math.random().toString(16).substring(2, 18)}`,
      message: `${method} executed successfully on ${contract}`,
      data: params
    };

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to interact with contract' },
      { status: 500 }
    );
  }
}
