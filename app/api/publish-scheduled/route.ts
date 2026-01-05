import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// This API will be called automatically when users visit the site
// No authentication needed - it's a safe operation that only publishes due posts
export async function GET() {
  try {

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
            currentPrice: call.ltp, // Initialize with entry price
            lastChecked: now, // Mark as just checked
          },
        })
      })
    )

    if (publishedCalls.length > 0) {
      console.log(`✅ Published ${publishedCalls.length} scheduled calls at ${now.toISOString()}`)
    }

    return NextResponse.json({
      success: true,
      published: publishedCalls.length,
      timestamp: now.toISOString(),
    })
  } catch (error) {
    console.error('Error publishing scheduled calls:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to publish scheduled calls' },
      { status: 500 }
    )
  }
}
