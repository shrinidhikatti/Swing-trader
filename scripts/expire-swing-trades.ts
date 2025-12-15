/**
 * Expire swing trades that are older than 30 days and haven't hit any target or stop loss
 * This script should be run periodically (e.g., daily via cron job)
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function expireSwingTrades() {
  console.log('Checking for expired swing trades...\n')

  try {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Find swing trades that are:
    // 1. ACTIVE status
    // 2. Trade type is SWING
    // 3. Older than 30 days
    // 4. Haven't hit any target or stop loss
    const expiredCalls = await prisma.tradingCall.findMany({
      where: {
        tradeType: 'SWING',
        status: 'ACTIVE',
        callDate: {
          lt: thirtyDaysAgo,
        },
        target1Hit: false,
        target2Hit: false,
        target3Hit: false,
        stopLossHit: false,
      },
    })

    console.log(`Found ${expiredCalls.length} expired swing trades\n`)

    if (expiredCalls.length === 0) {
      console.log('✅ No expired swing trades found!')
      return
    }

    let expiredCount = 0

    for (const call of expiredCalls) {
      const daysSinceCall = Math.floor(
        (Date.now() - new Date(call.callDate).getTime()) / (1000 * 60 * 60 * 24)
      )

      console.log(`Expiring ${call.scriptName} (${daysSinceCall} days old)`)

      await prisma.tradingCall.update({
        where: { id: call.id },
        data: {
          status: 'EXPIRED',
        },
      })

      expiredCount++
    }

    console.log('\n' + '='.repeat(60))
    console.log(`✅ Expired ${expiredCount} swing trades`)
    console.log('='.repeat(60))
  } catch (error) {
    console.error('Error expiring swing trades:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

expireSwingTrades()
  .then(() => {
    console.log('\n✅ Expiry check complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Expiry check failed:', error)
    process.exit(1)
  })
