import { NextResponse } from 'next/server';

// GET: Fetch NFT receipts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json(
      { error: 'Address is required' },
      { status: 400 }
    );
  }

  try {
    // Mock NFT receipts
    const receipts = [
      {
        tokenId: '1',
        owner: address,
        transactionHash: '0xabc123',
        metadata: {
          amount: '50.00',
          category: 'Food',
          description: 'Restaurant expense',
          timestamp: Date.now() / 1000,
          merchant: 'Pizza Place'
        },
        imageUrl: 'https://via.placeholder.com/300'
      },
      {
        tokenId: '2',
        owner: address,
        transactionHash: '0xdef456',
        metadata: {
          amount: '100.00',
          category: 'Transport',
          description: 'Gas station',
          timestamp: Date.now() / 1000 - 86400,
          merchant: 'Shell'
        },
        imageUrl: 'https://via.placeholder.com/300'
      }
    ];

    return NextResponse.json({ receipts });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch NFT receipts' },
      { status: 500 }
    );
  }
}

// POST: Mint new NFT receipt
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { address, amount, category, description, merchant, transactionHash } = body;

    if (!address || !amount || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Mock minting process
    const receipt = {
      tokenId: Math.floor(Math.random() * 10000).toString(),
      owner: address,
      transactionHash: transactionHash || `0x${Math.random().toString(16).substring(2, 18)}`,
      metadata: {
        amount,
        category,
        description,
        timestamp: Date.now() / 1000,
        merchant: merchant || 'Unknown'
      },
      imageUrl: 'https://via.placeholder.com/300',
      mintedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      receipt,
      message: 'NFT receipt minted successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to mint NFT receipt' },
      { status: 500 }
    );
  }
}
