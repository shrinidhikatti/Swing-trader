#!/usr/bin/env ts-node

/**
 * Script to send subscription renewal reminders
 * Sends emails to active users whose subscription ends tomorrow
 *
 * Usage:
 * - Run manually: npx ts-node scripts/send-renewal-reminders.ts
 * - Run via cron: Add to crontab to run daily (recommended: 9 AM IST)
 */

async function sendRenewalReminders() {
  try {
    console.log('🔔 Starting renewal reminder check...')
    console.log(`Timestamp: ${new Date().toISOString()}`)

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const cronSecret = process.env.CRON_SECRET || 'your-secret-key'

    const response = await fetch(`${baseUrl}/api/send-renewal-reminders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cronSecret}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('❌ Failed to send renewal reminders:', errorData)
      process.exit(1)
    }

    const result = await response.json()
    console.log('✅ Renewal reminders processed successfully')
    console.log(`Total users: ${result.total}`)
    console.log(`Emails sent: ${result.success}`)
    console.log(`Failed: ${result.failed}`)

    if (result.results && result.results.length > 0) {
      console.log('\nDetails:')
      result.results.forEach((r: any) => {
        console.log(`  ${r.email}: ${r.status}`)
      })
    }

    console.log('\n✅ Renewal reminder check complete')
  } catch (error) {
    console.error('❌ Error sending renewal reminders:', error)
    process.exit(1)
  }
}

// Run the script
sendRenewalReminders()
