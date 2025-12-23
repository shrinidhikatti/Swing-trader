import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { createUserSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    // Validation
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username/Email and password are required' },
        { status: 400 }
      )
    }

    // Find user by username or email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: username },
          { email: username },
        ],
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid username/email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid username/email or password' },
        { status: 401 }
      )
    }

    // Check if we're past the free access period (Jan 1, 2026)
    const now = new Date()
    const accessCutoff = new Date('2026-01-01T00:00:00.000Z')
    const isPastFreeAccess = now >= accessCutoff

    // After Jan 1, 2026, all users (including previously auto-approved) need approval
    if (isPastFreeAccess) {
      if (user.status !== 'APPROVED') {
        return NextResponse.json(
          { error: 'Access requires admin approval. The free access period has ended. Please contact admin.' },
          { status: 403 }
        )
      }
    } else {
      // Before Jan 1, 2026, check normal approval status
      if (user.status !== 'APPROVED') {
        return NextResponse.json(
          { error: 'Your account is pending admin approval' },
          { status: 403 }
        )
      }
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Your account has been deactivated' },
        { status: 403 }
      )
    }

    // Check subscription validity
    if (user.subscriptionEnd && new Date(user.subscriptionEnd) < now) {
      return NextResponse.json(
        { error: 'Your subscription has expired. Please contact admin.' },
        { status: 403 }
      )
    }

    if (user.subscriptionStart && new Date(user.subscriptionStart) > now) {
      return NextResponse.json(
        { error: 'Your subscription has not started yet' },
        { status: 403 }
      )
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: now },
    })

    // Create session
    const token = await createUserSession(user.username, user.id)

    // Set cookie
    const response = NextResponse.json(
      {
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
        },
      },
      { status: 200 }
    )

    response.cookies.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    )
  }
}
