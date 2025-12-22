import { NextResponse } from 'next/server';

// POST: Estimate gas for transaction
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { from, to, value, data, chainId } = body;

    if (!from || !to) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Mock gas estimation
    const gasEstimate = {
      gasLimit: data ? '100000' : '21000',
      gasPrice: '25000000000', // 25 Gwei
      maxFeePerGas: '30000000000', // 30 Gwei
      maxPriorityFeePerGas: '2000000000', // 2 Gwei
      estimatedCostETH: data ? '0.0025' : '0.000525',
      estimatedCostUSD: data ? 5.0 : 1.05,
      chainId: chainId || '0x1'
    };

    return NextResponse.json(gasEstimate);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to estimate gas' },
      { status: 500 }
    );
  }
}
