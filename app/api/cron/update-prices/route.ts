import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { fetchStockPrice } from '@/lib/stockApi'

/**
 * Vercel Cron Job - Runs every 15 minutes
 * Updates prices for all active trading calls
 * No authentication required (secured by Vercel Cron secret)
 */
export async function GET(request: NextRequest) {
  try {
    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('[CRON] Starting automatic price update...')

    // Fetch all active calls (not yet hit targets or stop loss)
    const activeCalls = await prisma.tradingCall.findMany({
      where: {
        status: 'ACTIVE',
      },
    })

    if (activeCalls.length === 0) {
      console.log('[CRON] No active calls to check')
      return NextResponse.json({
        message: 'No active calls to check',
        updated: 0,
        timestamp: new Date().toISOString(),
      })
    }

    let updatedCount = 0
    const results = []

    // Check each call
    for (const call of activeCalls) {
      const priceData = await fetchStockPrice(call.scriptName)

      if (!priceData) {
        console.error(`[CRON] Failed to fetch price for ${call.scriptName}`)
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
      if (!call.target1Hit && !call.target2Hit && !call.target3Hit && !call.stopLossHit) {
        // Fresh call - check what got hit
        const targetHit = dayHigh >= call.target1
        const slHit = dayLow <= call.stopLoss

        // If both target and SL were hit on same day, determine which happened first
        if (targetHit && slHit) {
          const distanceFromHigh = Math.abs(currentPrice - dayHigh)
          const distanceFromLow = Math.abs(currentPrice - dayLow)

          if (distanceFromLow < distanceFromHigh) {
            // SL hit first
            status = 'SL_HIT'
            stopLossHit = true
            hitDate = now
            stopLossHitDate = now
          } else {
            // Target hit first
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
          status = 'SL_HIT'
          stopLossHit = true
          hitDate = now
          stopLossHitDate = now
        } else if (targetHit) {
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
      } else {
        // Some targets already hit - check for higher targets only
        if (!call.target3Hit && call.target3 && dayHigh >= call.target3) {
          status = 'TARGET3_HIT'
          target3Hit = true
          target3HitDate = target3HitDate || now
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

    console.log(`[CRON] Checked ${activeCalls.length} calls, updated ${updatedCount}`)

    return NextResponse.json({
      success: true,
      message: `Checked ${activeCalls.length} calls, updated ${updatedCount}`,
      updated: updatedCount,
      timestamp: new Date().toISOString(),
      results,
    })
  } catch (error) {
    console.error('[CRON] Error checking prices:', error)
    return NextResponse.json(
      {
        error: 'Failed to check prices',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
