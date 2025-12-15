import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticatedFromRequest, getSession } from '@/lib/auth'

// PATCH - Update user status and subscription (ADMIN ONLY)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const isAdmin = await isAuthenticatedFromRequest(request)
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const session = await getSession()
    const adminUsername = session?.username || 'admin'

    const body = await request.json()
    const {
      status,
      isActive,
      subscriptionStart,
      subscriptionEnd,
      notes,
    } = body

    const updateData: any = {}

    if (status) {
      updateData.status = status
      if (status === 'APPROVED') {
        updateData.approvedBy = adminUsername
        updateData.approvedAt = new Date()
        updateData.isActive = isActive !== undefined ? isActive : true
      } else if (status === 'REJECTED') {
        updateData.isActive = false
      }
    }

    if (isActive !== undefined) {
      updateData.isActive = isActive
    }

    if (subscriptionStart !== undefined) {
      updateData.subscriptionStart = subscriptionStart ? new Date(subscriptionStart) : null
    }

    if (subscriptionEnd !== undefined) {
      updateData.subscriptionEnd = subscriptionEnd ? new Date(subscriptionEnd) : null
    }

    if (notes !== undefined) {
      updateData.notes = notes
    }

    const user = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
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

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a user (ADMIN ONLY)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const isAdmin = await isAuthenticatedFromRequest(request)
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    await prisma.user.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}
