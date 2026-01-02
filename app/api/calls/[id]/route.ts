import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticatedFromRequest } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// GET - Fetch a single trading call (PUBLIC)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const call = await prisma.tradingCall.findUnique({
      where: { id: params.id },
    })

    if (!call) {
      return NextResponse.json(
        { error: 'Trading call not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(call)
  } catch (error) {
    console.error('Error fetching call:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trading call' },
      { status: 500 }
    )
  }
}

// PUT - Update a trading call (ADMIN ONLY)
export async function PUT(
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

    const body = await request.json()

    const call = await prisma.tradingCall.update({
      where: { id: params.id },
      data: body,
    })

    return NextResponse.json(call)
  } catch (error) {
    console.error('Error updating call:', error)
    return NextResponse.json(
      { error: 'Failed to update trading call' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a trading call (ADMIN ONLY)
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

    await prisma.tradingCall.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Call deleted successfully' })
  } catch (error) {
    console.error('Error deleting call:', error)
    return NextResponse.json(
      { error: 'Failed to delete trading call' },
      { status: 500 }
    )
  }
}
