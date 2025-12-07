import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({
        authenticated: false,
        user: null,
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
