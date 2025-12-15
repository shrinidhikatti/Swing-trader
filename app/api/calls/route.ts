import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticatedFromRequest } from '@/lib/auth'

// GET - Fetch all trading calls with optional date filter (PUBLIC)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const fromDate = searchParams.get('fromDate')
    const toDate = searchParams.get('toDate')
    const status = searchParams.get('status')

    // Check if admin
    const isAdmin = await isAuthenticatedFromRequest(request)

    const where: any = {}

    // TEMPORARILY DISABLED - Show all calls for testing
    // TODO: Re-enable 30-day filtering after testing

    // Date range filter
    if (fromDate || toDate) {
      where.callDate = {}

      if (fromDate) {
        const start = new Date(fromDate)
        start.setHours(0, 0, 0, 0)
        where.callDate.gte = start
      }

      if (toDate) {
        const end = new Date(toDate)
        end.setHours(23, 59, 59, 999)
        where.callDate.lte = end
      }
    }

    if (status) {
      where.status = status
    }

    const calls = await prisma.tradingCall.findMany({
      where,
      orderBy: [
        { isFlashCard: 'desc' }, // Flash cards first
        { callDate: 'desc' },     // Then by date (newest first)
      ],
    })

    return NextResponse.json(calls)
  } catch (error) {
    console.error('Error fetching calls:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trading calls' },
      { status: 500 }
    )
  }
}

// POST - Create a new trading call (ADMIN ONLY)
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

    const body = await request.json()

    const {
      scriptName,
      ltp,
      target1,
      target2,
      target3,
      stopLoss,
      patternType,
      longTermOutlook,
      rank,
      support,
      resistance,
      callDate,
      tradeType,
      isFlashCard,
      eventMarker,
    } = body

    // Validation
    if (!scriptName || !ltp || !target1 || !target2 || !target3 || !stopLoss || !patternType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const call = await prisma.tradingCall.create({
      data: {
        scriptName,
        ltp: parseFloat(ltp),
        target1: parseFloat(target1),
        target2: parseFloat(target2),
        target3: parseFloat(target3),
        stopLoss: parseFloat(stopLoss),
        patternType,
        longTermOutlook,
        rank: rank ? parseInt(rank) : null,
        support: support ? parseFloat(support) : null,
        resistance: resistance ? parseFloat(resistance) : null,
        callDate: callDate ? new Date(callDate) : new Date(),
        currentPrice: parseFloat(ltp),
        tradeType: tradeType || 'SWING',
        isFlashCard: isFlashCard || false,
        eventMarker: eventMarker || null,
      },
    })

    return NextResponse.json(call, { status: 201 })
  } catch (error) {
    console.error('Error creating call:', error)
    return NextResponse.json(
      { error: 'Failed to create trading call' },
      { status: 500 }
    )
  }
}
