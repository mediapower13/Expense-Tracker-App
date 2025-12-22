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
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Mock transaction creation
    const transaction = {
      hash: `0x${Math.random().toString(16).substring(2, 18)}`,
      from,
      to,
      value,
      token: token || 'ETH',
      timestamp: Date.now() / 1000,
      status: 'pending',
      category,
      description
    };

    return NextResponse.json({
      success: true,
      transaction
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create blockchain transaction' },
      { status: 500 }
    );
  }
}
