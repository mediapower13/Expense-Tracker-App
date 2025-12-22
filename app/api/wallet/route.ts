import { NextResponse } from 'next/server';

// GET: Fetch wallet info
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json(
      { error: 'Wallet address is required' },
      { status: 400 }
    );
  }

  try {
    // Mock wallet data - in production, fetch from blockchain
    const walletData = {
      address,
      balance: '1.5234',
      chainId: '0x1',
      tokens: [
        { symbol: 'USDC', balance: '1000.50' },
        { symbol: 'USDT', balance: '500.25' }
      ],
      nftReceipts: 5
    };

    return NextResponse.json(walletData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch wallet data' },
      { status: 500 }
    );
  }
}

// POST: Update wallet connection status
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { address, chainId, action } = body;

    if (action === 'connect') {
      // Store wallet connection in database
      return NextResponse.json({
        success: true,
        message: 'Wallet connected successfully',
        address,
        chainId
      });
    }

    if (action === 'disconnect') {
      return NextResponse.json({
        success: true,
        message: 'Wallet disconnected successfully'
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process wallet action' },
      { status: 500 }
    );
  }
}
