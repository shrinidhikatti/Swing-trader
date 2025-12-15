import axios from 'axios'

export interface StockPrice {
  symbol: string
  price: number
  dayHigh: number
  dayLow: number
  timestamp: Date
}

/**
 * Fetch current stock price from Yahoo Finance
 * Note: For Indian stocks, append .NS or .BO (NSE/BSE) to symbol
 * Example: RELIANCE.NS, TCS.BO
 */
export async function fetchStockPrice(symbol: string): Promise<StockPrice | null> {
  try {
    // Add .NS suffix for NSE stocks if not already present
    const formattedSymbol = symbol.includes('.') ? symbol : `${symbol}.NS`

    // Using Yahoo Finance API v8
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${formattedSymbol}`

    const response = await axios.get(url, {
      params: {
        interval: '1d',
        range: '1d'
      },
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    })

    const result = response.data?.chart?.result?.[0]
    if (!result) {
      console.error(`No data found for symbol: ${formattedSymbol}`)
      return null
    }

    const meta = result.meta
    const currentPrice = meta?.regularMarketPrice || meta?.previousClose
    const dayHigh = meta?.regularMarketDayHigh || currentPrice
    const dayLow = meta?.regularMarketDayLow || currentPrice

    if (!currentPrice) {
      console.error(`No price data for symbol: ${formattedSymbol}`)
      return null
    }

    return {
      symbol: formattedSymbol,
      price: currentPrice,
      dayHigh: dayHigh,
      dayLow: dayLow,
      timestamp: new Date()
    }
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error)
    return null
  }
}

/**
 * Fetch multiple stock prices in parallel
 */
export async function fetchMultipleStockPrices(symbols: string[]): Promise<Map<string, number>> {
  const priceMap = new Map<string, number>()

  const results = await Promise.allSettled(
    symbols.map(symbol => fetchStockPrice(symbol))
  )

  results.forEach((result, index) => {
    if (result.status === 'fulfilled' && result.value) {
      priceMap.set(symbols[index], result.value.price)
    }
  })

  return priceMap
}
