import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticatedFromRequest } from '@/lib/auth'

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

// GET - Check last event check time
export async function GET(request: NextRequest) {
  try {
    const config = await prisma.appConfig.findUnique({
      where: { key: 'last_event_check' },
    })

    return NextResponse.json({
      lastChecked: config?.value || null,
    })
  } catch (error) {
    console.error('Error fetching last event check:', error)
    return NextResponse.json(
      { error: 'Failed to fetch last event check' },
      { status: 500 }
    )
  }
}

// POST - Check events for all active trading calls (ADMIN ONLY)
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const isAdmin = await isAuthenticatedFromRequest(request)
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    console.log('Starting event check for all active calls...')

    // Get all active calls
    const activeCalls = await prisma.tradingCall.findMany({
      where: {
        status: 'ACTIVE',
      },
    })

    console.log(`Found ${activeCalls.length} active calls`)

    let updatedCount = 0
    const errors: string[] = []

    // Check events for each call
    for (const call of activeCalls) {
      try {
        console.log(`Checking events for ${call.scriptName}...`)

        const eventMarker = await fetchStockEvents(call.scriptName)

        // Only update if we found events
        if (eventMarker) {
          await prisma.tradingCall.update({
            where: { id: call.id },
            data: {
              eventMarker,
            },
          })
          updatedCount++
          console.log(`Updated ${call.scriptName} with event: ${eventMarker}`)
        } else if (call.eventMarker) {
          // Clear old event markers if no current events
          await prisma.tradingCall.update({
            where: { id: call.id },
            data: { eventMarker: null },
          })
          console.log(`Cleared old event marker for ${call.scriptName}`)
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500))
      } catch (error: any) {
        console.error(`Error checking events for ${call.scriptName}:`, error)
        errors.push(`${call.scriptName}: ${error.message}`)
      }
    }

    // Update last checked time
    const now = new Date()
    await prisma.appConfig.upsert({
      where: { key: 'last_event_check' },
      update: { value: now.toISOString() },
      create: { key: 'last_event_check', value: now.toISOString() },
    })

    console.log(`Event check complete. Updated ${updatedCount} calls.`)

    return NextResponse.json({
      message: 'Event check completed',
      checked: activeCalls.length,
      updated: updatedCount,
      errors: errors.length > 0 ? errors : undefined,
      lastChecked: now.toISOString(),
    })
  } catch (error) {
    console.error('Error checking events:', error)
    return NextResponse.json(
      { error: 'Failed to check events' },
      { status: 500 }
    )
  }
}
