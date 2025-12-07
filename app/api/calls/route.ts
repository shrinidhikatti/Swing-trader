import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch all trading calls with optional date filter
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const date = searchParams.get('date')
    const status = searchParams.get('status')

    const where: any = {}

    if (date) {
      const startDate = new Date(date)
      startDate.setHours(0, 0, 0, 0)
      const endDate = new Date(date)
      endDate.setHours(23, 59, 59, 999)

      where.callDate = {
        gte: startDate,
        lte: endDate,
      }
    }

    if (status) {
      where.status = status
    }

    const calls = await prisma.tradingCall.findMany({
      where,
      orderBy: {
        callDate: 'desc',
      },
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

// POST - Create a new trading call
export async function POST(request: NextRequest) {
  try {
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
