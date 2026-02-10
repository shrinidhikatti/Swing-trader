import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({
        authenticated: false,
        user: null,
      })
    }

    // Auto-deactivate users with expired subscriptions (only for admin sessions)
    if (session.isAdmin) {
      const now = new Date()
      await prisma.user.updateMany({
        where: {
          subscriptionEnd: {
            lt: now,
          },
          isActive: true, // Only update if they're currently active
        },
        data: {
          isActive: false,
        },
      })
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        username: session.username,
        isAdmin: session.isAdmin,
      },
    })
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json(
      { error: 'Failed to check authentication' },
      { status: 500 }
    )
  }
}
