import { NextRequest, NextResponse } from 'next/server'

/**
 * Fetch corporate actions and events for a stock from Yahoo Finance
 */
async function fetchStockEvents(symbol: string): Promise<string | null> {
  try {
    // Add .NS for NSE stocks if not already present
    const yahooSymbol = symbol.includes('.') ? symbol : `${symbol}.NS`

    // Fetch calendar events (dividends, earnings, splits)
    const calendarUrl = `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${yahooSymbol}?modules=calendarEvents`
    const calendarResponse = await fetch(calendarUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })

    if (!calendarResponse.ok) {
      console.log(`No calendar data for ${symbol}`)
      return null
    }

    const calendarData = await calendarResponse.json()
    const events = calendarData?.quoteSummary?.result?.[0]?.calendarEvents

    if (!events) {
      return null
    }

    const eventMarkers: string[] = []

    // Check for dividend
    if (events.dividendDate?.raw) {
      const dividendDate = new Date(events.dividendDate.raw * 1000)
      const daysUntil = Math.floor((dividendDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

      // If dividend is within next 90 days or past 30 days
      if (daysUntil >= -30 && daysUntil <= 90) {
        eventMarkers.push('Dividend')
      }
    }

    // Check for earnings
    if (events.earnings?.earningsDate?.[0]?.raw) {
      const earningsDate = new Date(events.earnings.earningsDate[0].raw * 1000)
      const daysUntil = Math.floor((earningsDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

      // If earnings is within next 30 days or past 7 days
      if (daysUntil >= -7 && daysUntil <= 30) {
        eventMarkers.push('Earnings')
      }
    }

    // Try to fetch splits and other corporate actions from a different endpoint
    try {
      const chartUrl = `https://query2.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?range=3mo&events=split,div`
      const chartResponse = await fetch(chartUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      })

      if (chartResponse.ok) {
        const chartData = await chartResponse.json()
        const result = chartData?.chart?.result?.[0]

        // Check for splits
        if (result?.events?.splits) {
          const splits = Object.values(result.events.splits)
          if (splits.length > 0) {
            eventMarkers.push('Split')
          }
        }
      }
    } catch (error) {
      console.log(`Could not fetch split data for ${symbol}`)
    }

    // Return combined event markers
    if (eventMarkers.length > 0) {
      return eventMarkers.join(', ')
    }

    return null
  } catch (error) {
    console.error(`Error fetching events for ${symbol}:`, error)
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const symbol = searchParams.get('symbol')

    if (!symbol) {
      return NextResponse.json(
        { success: false, error: 'Symbol is required' },
        { status: 400 }
      )
    }

    const eventMarker = await fetchStockEvents(symbol)

    return NextResponse.json({
      success: true,
      symbol,
      eventMarker,
      message: eventMarker ? `Events found: ${eventMarker}` : 'No upcoming events',
    })
  } catch (error) {
    console.error('Error fetching stock events:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}
