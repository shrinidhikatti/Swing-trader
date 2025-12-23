import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, email, fullName, phone, password } = body

    // Validation
    if (!username || !email || !fullName || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if username already exists
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    })

    if (existingUsername) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    })

    if (existingEmail) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Check if registration is before Jan 1, 2026 (free access period)
    const now = new Date()
    const freeAccessCutoff = new Date('2026-01-01T00:00:00.000Z')
    const isFreeAccessPeriod = now < freeAccessCutoff

    // Auto-approve users during free access period (before Jan 1, 2026)
    const status = isFreeAccessPeriod ? 'APPROVED' : 'PENDING'
    const isActive = isFreeAccessPeriod

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        fullName,
        phone: phone || null,
        password: hashedPassword,
        status,
        isActive,
      },
    })

    const message = isFreeAccessPeriod
      ? 'Registration successful! You now have full access. (Free access period until Dec 31, 2025)'
      : 'Registration successful. Awaiting admin approval.'

    return NextResponse.json(
      {
        message,
        userId: user.id,
        autoApproved: isFreeAccessPeriod,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    )
  }
}
