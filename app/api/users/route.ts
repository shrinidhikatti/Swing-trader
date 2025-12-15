import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticatedFromRequest } from '@/lib/auth'

// GET - Fetch all users (ADMIN ONLY)
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const isAdmin = await isAuthenticatedFromRequest(request)
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const users = await prisma.user.findMany({
      orderBy: [
        { status: 'asc' }, // PENDING first
        { createdAt: 'desc' },
      ],
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        phone: true,
        status: true,
        isActive: true,
        subscriptionStart: true,
        subscriptionEnd: true,
        createdAt: true,
        approvedBy: true,
        approvedAt: true,
        lastLogin: true,
        notes: true,
      },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
