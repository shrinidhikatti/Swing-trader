import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'
import crypto from 'crypto'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    })

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        message: 'If an account with that email exists, a password reset link has been sent.',
      })
    }

    // Generate unique token
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now

    // Store token in database
    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    })

    // Get the base URL for the reset link
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.headers.get('origin') || 'http://localhost:3000'
    const resetLink = `${baseUrl}/reset-password/${token}`

    // Send email via Resend
    try {
      const emailResult = await resend.emails.send({
        from: 'Swing Trader Sagar <noreply@tradewithsagar.com>',
        to: user.email,
        subject: 'Reset Your Password - Swing Trader Sagar',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 28px;">Swing Trader Sagar</h1>
              </div>

              <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
                <h2 style="color: #333; margin-top: 0;">Password Reset Request</h2>

                <p>Hi ${user.fullName || user.username},</p>

                <p>We received a request to reset your password. Click the button below to create a new password:</p>

                <div style="text-align: center; margin: 30px 0;">
                  <a href="${resetLink}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reset Password</a>
                </div>

                <p>Or copy and paste this link into your browser:</p>
                <p style="background: #f5f5f5; padding: 10px; border-radius: 5px; word-break: break-all; font-size: 14px;">
                  ${resetLink}
                </p>

                <p style="color: #666; font-size: 14px; margin-top: 30px;">
                  <strong>This link will expire in 1 hour.</strong>
                </p>

                <p style="color: #666; font-size: 14px;">
                  If you didn't request this password reset, you can safely ignore this email. Your password will not be changed.
                </p>

                <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">

                <p style="color: #999; font-size: 12px; text-align: center;">
                  © 2025 Swing Trader Sagar. All rights reserved.
                </p>
              </div>
            </body>
          </html>
        `,
      })

      // Check if email was sent successfully
      if (emailResult.error) {
        console.error('❌ Resend API error:', emailResult.error)
        // In development, if domain not verified, still return success to prevent enumeration
        // but log the error for admin visibility
        console.error('Email sending failed but returning success to prevent enumeration')
      } else {
        console.log('✅ Password reset email sent successfully to:', user.email)
        console.log('Email result:', emailResult)
      }
    } catch (emailError) {
      console.error('❌ Error sending email:', emailError)
      // Log more details about the error
      if (emailError instanceof Error) {
        console.error('Error message:', emailError.message)
        console.error('Error stack:', emailError.stack)
      }
      // Still return success to prevent email enumeration
      console.error('Email sending failed but returning success to prevent enumeration')
    }

    return NextResponse.json({
      message: 'If an account with that email exists, a password reset link has been sent.',
    })
  } catch (error) {
    console.error('Error in forgot password:', error)
    return NextResponse.json(
      { error: 'An error occurred. Please try again later.' },
      { status: 500 }
    )
  }
}
