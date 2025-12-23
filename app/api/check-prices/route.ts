import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { fetchStockPrice } from '@/lib/stockApi'
import { isAuthenticatedFromRequest } from '@/lib/auth'

/**
 * API endpoint to check and update prices for active trading calls (ADMIN ONLY)
 * This can be called manually or via cron job
 */
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

    // Fetch all active calls (not yet hit targets or stop loss)
    const activeCalls = await prisma.tradingCall.findMany({
      where: {
        status: 'ACTIVE',
      },
    })

    if (activeCalls.length === 0) {
      return NextResponse.json({
        message: 'No active calls to check',
        updated: 0,
      })
    }

    let updatedCount = 0
    const results = []

    // Check each call
    for (const call of activeCalls) {
      const priceData = await fetchStockPrice(call.scriptName)

      if (!priceData) {
        console.error(`Failed to fetch price for ${call.scriptName}`)
        results.push({
          id: call.id,
          scriptName: call.scriptName,
          error: 'Failed to fetch price',
        })
        continue
      }

      const currentPrice = priceData.price
      const dayHigh = priceData.dayHigh
      const dayLow = priceData.dayLow

      let status = call.status
      let target1Hit = call.target1Hit
      let target2Hit = call.target2Hit
      let target3Hit = call.target3Hit
      let stopLossHit = call.stopLossHit
      let hitDate = call.hitDate
      let target1HitDate = call.target1HitDate
      let target2HitDate = call.target2HitDate
      let target3HitDate = call.target3HitDate
      let stopLossHitDate = call.stopLossHitDate

      const now = new Date()

      // Check if targets or stop loss hit
      // Important: Use dayHigh for targets (captures intraday highs)
      // Use dayLow for stop loss (captures intraday lows)
      // This ensures we don't miss targets/SL that were hit during the day

      if (!call.target1Hit && !call.target2Hit && !call.target3Hit && !call.stopLossHit) {
        // Fresh call - check what got hit
        // IMPORTANT: When both target and SL are hit on same day, we need to determine which happened first

        const targetHit = dayHigh >= call.target1
        const slHit = dayLow <= call.stopLoss

        // If both target and SL were hit on same day, determine which likely happened first
        // Logic: Check current price position - if closer to low, SL hit first; if closer to high, target hit first
        if (targetHit && slHit) {
          // Both hit on same day - use current price to determine which happened first
          const distanceFromHigh = Math.abs(currentPrice - dayHigh)
          const distanceFromLow = Math.abs(currentPrice - dayLow)

          // If current price is closer to dayLow, stop loss likely hit first (and stayed low)
          // If current price is closer to dayHigh, target likely hit first (and stayed high)
          if (distanceFromLow < distanceFromHigh) {
            // Price is closer to low - SL hit first, then might have recovered
            // But since SL hit first, trader would have exited
            status = 'SL_HIT'
            stopLossHit = true
            hitDate = now
            stopLossHitDate = now
          } else {
            // Price is closer to high - Target hit first
            // Check which target level
            if (call.target3 && dayHigh >= call.target3) {
              status = 'TARGET3_HIT'
              target1Hit = true
              target2Hit = true
              target3Hit = true
              hitDate = now
              target1HitDate = now
              target2HitDate = now
              target3HitDate = now
            } else if (dayHigh >= call.target2) {
              status = 'TARGET2_HIT'
              target1Hit = true
              target2Hit = true
              hitDate = now
              target1HitDate = now
              target2HitDate = now
            } else {
              status = 'TARGET1_HIT'
              target1Hit = true
              hitDate = now
              target1HitDate = now
            }
          }
        } else if (slHit) {
          // Only stop loss hit
          status = 'SL_HIT'
          stopLossHit = true
          hitDate = now
          stopLossHitDate = now
        } else if (targetHit) {
          // Only target hit (no SL)
          if (call.target3 && dayHigh >= call.target3) {
            status = 'TARGET3_HIT'
            target1Hit = true
            target2Hit = true
            target3Hit = true
            hitDate = now
            target1HitDate = now
            target2HitDate = now
            target3HitDate = now
          } else if (dayHigh >= call.target2) {
            status = 'TARGET2_HIT'
            target1Hit = true
            target2Hit = true
            hitDate = now
            target1HitDate = now
            target2HitDate = now
          } else {
            status = 'TARGET1_HIT'
            target1Hit = true
            hitDate = now
            target1HitDate = now
          }
        }
      } else if (call.stopLossHit) {
        // Stop loss already hit - no further checks needed
        // Keep existing status
      } else {
        // Some targets already hit - check for higher targets only
        if (!call.target3Hit && call.target3 && dayHigh >= call.target3) {
          status = 'TARGET3_HIT'
          target3Hit = true
          target3HitDate = target3HitDate || now
          // Also mark lower targets if not already marked
          target1Hit = true
          target2Hit = true
          target1HitDate = target1HitDate || now
          target2HitDate = target2HitDate || now
        } else if (!call.target2Hit && dayHigh >= call.target2) {
          status = 'TARGET2_HIT'
          target2Hit = true
          target2HitDate = target2HitDate || now
          target1Hit = true
          target1HitDate = target1HitDate || now
        }
        // If target already hit, don't check stop loss anymore
      }

      // Update the call
      const updated = await prisma.tradingCall.update({
        where: { id: call.id },
        data: {
          currentPrice,
          status,
          target1Hit,
          target2Hit,
          target3Hit,
          stopLossHit,
          hitDate,
          target1HitDate,
          target2HitDate,
          target3HitDate,
          stopLossHitDate,
          lastChecked: new Date(),
        },
      })

      updatedCount++
      results.push({
        id: updated.id,
        scriptName: updated.scriptName,
        currentPrice,
        status,
        previousStatus: call.status,
      })
    }

    return NextResponse.json({
      message: `Checked ${activeCalls.length} calls, updated ${updatedCount}`,
      updated: updatedCount,
      results,
    })
  } catch (error) {
    console.error('Error checking prices:', error)
    return NextResponse.json(
      { error: 'Failed to check prices' },
      { status: 500 }
    )
  }
}

// GET - Get last check status (PUBLIC)
export async function GET() {
  try {
    const lastChecked = await prisma.tradingCall.findFirst({
      where: {
        lastChecked: { not: null },
      },
      orderBy: {
        lastChecked: 'desc',
      },
      select: {
        lastChecked: true,
      },
    })

    return NextResponse.json({
      lastChecked: lastChecked?.lastChecked || null,
    })
  } catch (error) {
    console.error('Error getting last check status:', error)
    return NextResponse.json(
      { error: 'Failed to get status' },
      { status: 500 }
    )
  }
}
