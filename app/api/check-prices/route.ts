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
      if (currentPrice >= call.target3) {
        status = 'TARGET3_HIT'
        target1Hit = true
        target2Hit = true
        target3Hit = true
        hitDate = hitDate || now
        target1HitDate = target1HitDate || now
        target2HitDate = target2HitDate || now
        target3HitDate = target3HitDate || now
      } else if (currentPrice >= call.target2) {
        status = 'TARGET2_HIT'
        target1Hit = true
        target2Hit = true
        hitDate = hitDate || now
        target1HitDate = target1HitDate || now
        target2HitDate = target2HitDate || now
      } else if (currentPrice >= call.target1) {
        status = 'TARGET1_HIT'
        target1Hit = true
        hitDate = hitDate || now
        target1HitDate = target1HitDate || now
      } else if (currentPrice <= call.stopLoss) {
        status = 'SL_HIT'
        stopLossHit = true
        hitDate = hitDate || now
        stopLossHitDate = stopLossHitDate || now
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
