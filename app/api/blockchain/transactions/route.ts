import { NextResponse } from 'next/server';

// GET: Fetch blockchain transactions
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  const limit = searchParams.get('limit') || '10';

  if (!address) {
    return NextResponse.json(
      { error: 'Address is required' },
      { status: 400 }
    );
  }

  try {
    // Mock blockchain transactions
    const transactions = [
      {
        hash: '0x1234567890abcdef',
        from: address,
        to: '0xabcdef1234567890',
        value: '0.5',
        token: 'ETH',
        timestamp: Date.now() / 1000,
        status: 'confirmed',
        type: 'expense',
        category: 'Food',
        description: 'Restaurant payment'
      },
      {
        hash: '0xfedcba0987654321',
        from: '0x9876543210fedcba',
        to: address,
        value: '1.2',
        token: 'ETH',
        timestamp: Date.now() / 1000 - 3600,
        status: 'confirmed',
        type: 'income',
        category: 'Salary',
        description: 'Freelance payment'
      }
    ];

    return NextResponse.json({
      transactions: transactions.slice(0, parseInt(limit)),
      total: transactions.length
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch blockchain transactions' },
      { status: 500 }
    );
  }
}

// POST: Create blockchain transaction
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { from, to, value, token, category, description } = body;

    // Validate input
    if (!from || !to || !value) {
      return NextResponse.json(
        { error: 'Missing required fields: from, to, and value are required' },
        { status: 400 }
      );
    }

    // Validate Ethereum addresses
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!ethAddressRegex.test(from) || !ethAddressRegex.test(to)) {
      return NextResponse.json(
        { error: 'Invalid Ethereum address format' },
        { status: 400 }
      );
    }

    // Validate value is a positive number
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue <= 0) {
      return NextResponse.json(
        { error: 'Value must be a positive number' },
        { status: 400 }
      );
    }

    // Mock transaction creation
    const transaction = {
      hash: `0x${Math.random().toString(16).substring(2, 66).padEnd(64, '0')}`,
      from,
      to,
      value: numValue.toString(),
      token: token || 'ETH',
      timestamp: Math.floor(Date.now() / 1000),
      status: 'pending',
      category: category || 'Uncategorized',
      description: description || ''
    };

    return NextResponse.json({
      success: true,
      transaction
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to create blockchain transaction', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
