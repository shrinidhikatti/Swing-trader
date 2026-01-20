import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * API endpoint to send subscription renewal reminders
 * Checks for active users whose subscription ends tomorrow
 * Called automatically when users visit the site (no cron needed)
 * Includes smart throttling to run only once per day
 */
export async function POST(request: NextRequest) {
  try {
    // Check if we already ran today (smart throttling to prevent duplicate emails)
    const todayIST = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
    todayIST.setHours(0, 0, 0, 0)

    // Use a special "system" announcement as a marker for last run
    const lastRunMarker = await prisma.announcement.findFirst({
      where: {
        message: { startsWith: '[SYSTEM_RENEWAL_CHECK_' },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (lastRunMarker) {
      const markerDate = lastRunMarker.message.split('_')[3] // Extract date from marker
      const lastRunDate = new Date(markerDate)
      lastRunDate.setHours(0, 0, 0, 0)

      if (lastRunDate.getTime() === todayIST.getTime()) {
        // Already ran today, skip
        return NextResponse.json({
          message: 'Renewal check already ran today',
          skipped: true,
          lastRun: lastRunDate,
        })
      }
    }

    // Get tomorrow's date at midnight IST
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)

    const dayAfterTomorrow = new Date(tomorrow)
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1)

    // Find all active users whose subscription ends tomorrow
    const expiringUsers = await prisma.user.findMany({
      where: {
        isActive: true,
        status: 'APPROVED',
        subscriptionEnd: {
          gte: tomorrow, // Greater than or equal to tomorrow midnight
          lt: dayAfterTomorrow, // Less than day after tomorrow midnight
        },
      },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        subscriptionEnd: true,
      },
    })

    if (expiringUsers.length === 0) {
      return NextResponse.json({
        message: 'No users with expiring subscriptions tomorrow',
        count: 0,
      })
    }

    const results = []
    let successCount = 0
    let failCount = 0

    // Send reminder email to each user
    for (const user of expiringUsers) {
      try {
        const expiryDate = user.subscriptionEnd
          ? new Date(user.subscriptionEnd).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })
          : 'N/A'

        const emailResult = await resend.emails.send({
          from: 'Swing Trader Sagar <noreply@tradewithsagar.com>',
          to: user.email,
          subject: 'Subscription Expiring Tomorrow - Renew Now!',
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
                  <h2 style="color: #333; margin-top: 0;">⏰ Subscription Expiring Soon</h2>

                  <p>Hi ${user.fullName || user.username},</p>

                  <p>This is a friendly reminder that your subscription to Swing Trader Sagar will expire <strong>tomorrow (${expiryDate})</strong>.</p>

                  <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
                    <p style="margin: 0; color: #856404;">
                      <strong>⚠️ Action Required:</strong> To continue accessing premium trading calls and insights, please renew your subscription before it expires.
                    </p>
                  </div>

                  <p><strong>Why renew?</strong></p>
                  <ul style="line-height: 1.8;">
                    <li>Continue receiving daily trading calls</li>
                    <li>Access to real-time target and stop-loss updates</li>
                    <li>Stay connected with our active trading community</li>
                    <li>Never miss profitable opportunities</li>
                  </ul>

                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://tradewithsagar.com'}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Renew Subscription</a>
                  </div>

                  <p style="color: #666; font-size: 14px;">
                    If you have any questions or need assistance with renewal, please contact our support team.
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

        if (emailResult.error) {
          console.error(`❌ Failed to send reminder to ${user.email}:`, emailResult.error)
          failCount++
          results.push({
            email: user.email,
            status: 'failed',
            error: emailResult.error,
          })
        } else {
          console.log(`✅ Renewal reminder sent to: ${user.email}`)
          successCount++
          results.push({
            email: user.email,
            status: 'sent',
            messageId: emailResult.data?.id || 'unknown',
          })
        }
      } catch (emailError) {
        console.error(`❌ Error sending email to ${user.email}:`, emailError)
        failCount++
        results.push({
          email: user.email,
          status: 'error',
          error: emailError instanceof Error ? emailError.message : 'Unknown error',
        })
      }
    }

    // Create a hidden marker to track that we ran today (prevents duplicate runs)
    const markerMessage = `[SYSTEM_RENEWAL_CHECK_${todayIST.toISOString().split('T')[0]}]`
    await prisma.announcement.create({
      data: {
        message: markerMessage,
        isActive: false, // Hidden from public
      },
    })

    return NextResponse.json({
      message: `Processed ${expiringUsers.length} users expiring tomorrow`,
      total: expiringUsers.length,
      success: successCount,
      failed: failCount,
      results,
    })
  } catch (error) {
    console.error('Error in send-renewal-reminders:', error)
    return NextResponse.json(
      { error: 'Failed to process renewal reminders' },
      { status: 500 }
    )
  }
}

// GET - Manual trigger for testing (admin only in production)
export async function GET() {
  try {
    // Get tomorrow's date info for display
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)

    const dayAfterTomorrow = new Date(tomorrow)
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1)

    // Find users expiring tomorrow (without sending emails)
    const expiringUsers = await prisma.user.findMany({
      where: {
        isActive: true,
        status: 'APPROVED',
        subscriptionEnd: {
          gte: tomorrow,
          lt: dayAfterTomorrow,
        },
      },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        subscriptionEnd: true,
      },
    })

    return NextResponse.json({
      message: 'Preview of users with subscriptions expiring tomorrow',
      count: expiringUsers.length,
      expiringTomorrow: expiringUsers.map((u) => ({
        email: u.email,
        username: u.username,
        fullName: u.fullName,
        expiresOn: u.subscriptionEnd,
      })),
    })
  } catch (error) {
    console.error('Error checking expiring users:', error)
    return NextResponse.json(
      { error: 'Failed to check expiring users' },
      { status: 500 }
    )
  }
}
