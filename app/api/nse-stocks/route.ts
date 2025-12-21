import { NextResponse } from 'next/server'

/**
 * Fetch all NSE stocks from NSE India website
 * This endpoint fetches the complete list of equity symbols traded on NSE
 */
export async function GET() {
  try {
    // NSE India API endpoint for all equity symbols
    const url = 'https://www.nseindia.com/api/equity-stockIndices?index=SECURITIES%20IN%20F%26O'

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
      },
    })

    if (!response.ok) {
      // Fallback: Try alternate NSE endpoint for all securities
      const alternateUrl = 'https://archives.nseindia.com/content/equities/EQUITY_L.csv'
      const csvResponse = await fetch(alternateUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      })

      if (csvResponse.ok) {
        const csvText = await csvResponse.text()
        const lines = csvText.split('\n').slice(1) // Skip header
        const stocks = lines
          .map(line => {
            const parts = line.split(',')
            return parts[0]?.trim().replace(/"/g, '')
          })
          .filter(symbol => symbol && symbol.length > 0)
          .sort()

        return NextResponse.json({
          success: true,
          stocks: [...new Set(stocks)], // Remove duplicates
          count: stocks.length,
          source: 'NSE Archives CSV',
        })
      }

      throw new Error('Failed to fetch from NSE')
    }

    const data = await response.json()
    const stocks = data.data?.map((item: any) => item.symbol).filter(Boolean).sort()

    return NextResponse.json({
      success: true,
      stocks: [...new Set(stocks)], // Remove duplicates
      count: stocks.length,
      source: 'NSE API',
    })
  } catch (error) {
    console.error('Error fetching NSE stocks:', error)

    // Ultimate fallback: Return curated list from our database
    const { NSE_STOCKS } = await import('@/lib/nse-stocks')

    return NextResponse.json({
      success: true,
      stocks: NSE_STOCKS,
      count: NSE_STOCKS.length,
      source: 'Local Cache',
      note: 'Using cached stock list due to NSE API unavailability',
    })
  }
}
