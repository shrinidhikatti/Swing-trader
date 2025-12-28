import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// This API will be called by a cron job to publish scheduled calls
// Vercel Cron or external service should call this every minute or at 8:45 AM
export async function POST(request: Request) {
  try {
    // Optional: Add authorization header check for cron jobs
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const now = new Date()

    // Find all scheduled calls that should be published now
    const scheduledCalls = await prisma.tradingCall.findMany({
      where: {
        isPublished: false,
        status: 'SCHEDULED',
        scheduledFor: {
          lte: now, // Scheduled time has passed
        },
      },
    })

    // Publish all due calls
    const publishedCalls = await Promise.all(
      scheduledCalls.map(async (call) => {
        return await prisma.tradingCall.update({
          where: { id: call.id },
          data: {
            isPublished: true,
            status: 'ACTIVE',
          },
        })
      })
    )

    console.log(`Published ${publishedCalls.length} scheduled calls`)

    return NextResponse.json({
      success: true,
      published: publishedCalls.length,
      calls: publishedCalls.map(c => ({
        id: c.id,
        scriptName: c.scriptName,
        scheduledFor: c.scheduledFor,
      })),
    })
  } catch (error) {
    console.error('Error publishing scheduled calls:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to publish scheduled calls' },
      { status: 500 }
    )
  }
}

// GET endpoint for testing (can be removed in production)
export async function GET() {
  try {
    const now = new Date()

    const scheduledCalls = await prisma.tradingCall.findMany({
      where: {
        isPublished: false,
        status: 'SCHEDULED',
      },
      select: {
        id: true,
        scriptName: true,
        scheduledFor: true,
        callDate: true,
      },
    })

    return NextResponse.json({
      now: now.toISOString(),
      scheduledCalls,
      count: scheduledCalls.length,
    })
  } catch (error) {
    console.error('Error fetching scheduled calls:', error)
    return NextResponse.json(
      { error: 'Failed to fetch scheduled calls' },
      { status: 500 }
    )
  }
}
