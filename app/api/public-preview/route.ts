import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * PUBLIC API endpoint to fetch limited successful trading calls for landing page preview
 * Shows 4-5 target hit calls to attract new users
 */
export async function GET() {
  try {
    // Fetch recent calls where at least Target 1 was hit
    const successfulCalls = await prisma.tradingCall.findMany({
      where: {
        OR: [
          { target1Hit: true },
          { target2Hit: true },
          { target3Hit: true },
        ],
      },
      orderBy: {
        hitDate: 'desc', // Most recent hits first
      },
      take: 5, // Limit to 5 calls
      select: {
        id: true,
        scriptName: true,
        ltp: true,
        currentPrice: true,
        target1: true,
        target2: true,
        target3: true,
        target1Hit: true,
        target2Hit: true,
        target3Hit: true,
        status: true,
        callDate: true,
        hitDate: true,
        patternType: true,
        eventMarker: true,
      },
    })

    return NextResponse.json({
      success: true,
      calls: successfulCalls,
      totalShown: successfulCalls.length,
    })
  } catch (error) {
    console.error('Error fetching preview calls:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch preview calls' },
      { status: 500 }
    )
  }
}
