import { NextRequest, NextResponse } from 'next/server'
import { fetchStockPrice } from '@/lib/stockApi'

/**
 * API endpoint to fetch current stock price
 * GET /api/stock-price?symbol=RELIANCE
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const symbol = searchParams.get('symbol')

    if (!symbol) {
      return NextResponse.json(
        { error: 'Symbol parameter is required' },
        { status: 400 }
      )
    }

    const priceData = await fetchStockPrice(symbol)

    if (!priceData) {
      return NextResponse.json(
        { error: `Failed to fetch price for ${symbol}` },
        { status: 404 }
      )
    }

    return NextResponse.json({
      symbol: priceData.symbol,
      price: priceData.price,
      timestamp: priceData.timestamp,
      success: true,
    })
  } catch (error) {
    console.error('Error fetching stock price:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stock price' },
      { status: 500 }
    )
  }
}
