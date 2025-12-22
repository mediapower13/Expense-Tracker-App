import { NextResponse } from 'next/server';

// GET: Fetch token balances
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  const chainId = searchParams.get('chainId') || '0x1';

  if (!address) {
    return NextResponse.json(
      { error: 'Address is required' },
      { status: 400 }
    );
  }

  try {
    // Mock token balances
    const balances = [
      {
        symbol: 'USDC',
        name: 'USD Coin',
        balance: '1000.50',
        decimals: 6,
        address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        valueUSD: 1000.50
      },
      {
        symbol: 'USDT',
        name: 'Tether USD',
        balance: '500.25',
        decimals: 6,
        address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        valueUSD: 500.25
      },
      {
        symbol: 'DAI',
        name: 'Dai Stablecoin',
        balance: '250.75',
        decimals: 18,
        address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        valueUSD: 250.75
      }
    ];

    const totalValueUSD = balances.reduce((sum, token) => sum + token.valueUSD, 0);

    return NextResponse.json({
      address,
      chainId,
      balances,
      totalValueUSD
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch token balances' },
      { status: 500 }
    );
  }
}
