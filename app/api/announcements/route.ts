import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticatedFromRequest } from '@/lib/auth'

// GET - Get all active announcements (PUBLIC)
export async function GET() {
  try {
    const announcements = await prisma.announcement.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(announcements)
  } catch (error) {
    console.error('Error fetching announcements:', error)
    return NextResponse.json(
      { error: 'Failed to fetch announcements' },
      { status: 500 }
    )
  }
}

// POST - Create new announcement (ADMIN ONLY)
export async function POST(request: NextRequest) {
  try {
    const isAdmin = await isAuthenticatedFromRequest(request)
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { message } = body

    if (!message || message.trim() === '') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    const announcement = await prisma.announcement.create({
      data: {
        message: message.trim(),
      },
    })

    return NextResponse.json(announcement)
  } catch (error) {
    console.error('Error creating announcement:', error)
    return NextResponse.json(
      { error: 'Failed to create announcement' },
      { status: 500 }
    )
  }
}

// PUT - Update announcement (ADMIN ONLY)
export async function PUT(request: NextRequest) {
  try {
    const isAdmin = await isAuthenticatedFromRequest(request)
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { id, message, isActive } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Announcement ID is required' },
        { status: 400 }
      )
    }

    const updateData: any = {}
    if (message !== undefined) updateData.message = message.trim()
    if (isActive !== undefined) updateData.isActive = isActive

    const announcement = await prisma.announcement.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(announcement)
  } catch (error) {
    console.error('Error updating announcement:', error)
    return NextResponse.json(
      { error: 'Failed to update announcement' },
      { status: 500 }
    )
  }
}

// DELETE - Delete announcement (ADMIN ONLY)
export async function DELETE(request: NextRequest) {
  try {
    const isAdmin = await isAuthenticatedFromRequest(request)
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Announcement ID is required' },
        { status: 400 }
      )
    }

    await prisma.announcement.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting announcement:', error)
    return NextResponse.json(
      { error: 'Failed to delete announcement' },
      { status: 500 }
    )
  }
}
