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

    // Hide scheduled/unpublished calls for non-admin users
    // Admin can see all calls including scheduled future calls
    if (!isAdmin) {
      where.isPublished = true // Only show published calls to non-admin users
    }

    // Date range filter (for manual filtering by users)
    if (fromDate || toDate) {
      if (!where.callDate) {
        where.callDate = {}
      }

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
      topPick,
      support,
      resistance,
      callDate,
      tradeType,
      isFlashCard,
      eventMarker,
    } = body

    // Validation
    if (!scriptName || !ltp || !target1 || !target2 || !stopLoss || !patternType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Scheduling logic
    const selectedDate = callDate ? new Date(callDate) : new Date()
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const selectedDateOnly = new Date(selectedDate)
    selectedDateOnly.setHours(0, 0, 0, 0)

    let scheduledFor = null
    let isPublished = true
    let status = 'ACTIVE'

    // If selected date is in the future, schedule for 8:45 AM on that date
    if (selectedDateOnly > today) {
      // Set to 8:45 AM on the selected date
      scheduledFor = new Date(selectedDate)
      scheduledFor.setHours(8, 45, 0, 0)

      isPublished = false
      status = 'SCHEDULED'
    }

    const call = await prisma.tradingCall.create({
      data: {
        scriptName,
        ltp: parseFloat(ltp),
        target1: parseFloat(target1),
        target2: parseFloat(target2),
        target3: target3 ? parseFloat(target3) as number : null,
        stopLoss: parseFloat(stopLoss),
        patternType,
        longTermOutlook: longTermOutlook || null,
        rank: rank ? parseInt(rank) as number : null,
        topPick: topPick ? parseInt(topPick) as number : null,
        support: support ? parseFloat(support) as number : null,
        resistance: resistance ? parseFloat(resistance) as number : null,
        callDate: selectedDate,
        currentPrice: parseFloat(ltp),
        tradeType: tradeType || 'SWING',
        isFlashCard: isFlashCard || false,
        eventMarker: eventMarker || null,
        scheduledFor,
        isPublished,
        status,
      },
    })

    return NextResponse.json(call, { status: 201 })
  } catch (error: any) {
    console.error('Error creating call:', error)
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      meta: error.meta,
    })
    return NextResponse.json(
      {
        error: 'Failed to create trading call',
        details: error.message
      },
      { status: 500 }
    )
  }
}
