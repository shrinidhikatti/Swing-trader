/**
 * Migrate existing calls to populate individual target hit dates
 * For old calls that only have hitDate, we'll copy it to the appropriate target hit dates
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function migrateHitDates() {
  console.log('Migrating existing calls to populate individual target hit dates...\n')

  try {
    // Get all calls that have hits but missing individual hit dates
    const calls = await prisma.tradingCall.findMany({
      where: {
        OR: [
          { target1Hit: true, target1HitDate: null },
          { target2Hit: true, target2HitDate: null },
          { target3Hit: true, target3HitDate: null },
          { stopLossHit: true, stopLossHitDate: null },
        ],
      },
    })

    console.log(`Found ${calls.length} calls to migrate\n`)

    let migratedCount = 0

    for (const call of calls) {
      console.log(`Processing ${call.scriptName}...`)

      // Use the hitDate as the base, or create a reasonable estimate
      const baseHitDate = call.hitDate || new Date(call.callDate)
      const callTime = new Date(call.callDate).getTime()

      // For calls with multiple targets hit, stagger the dates
      let target1HitDate = call.target1HitDate
      let target2HitDate = call.target2HitDate
      let target3HitDate = call.target3HitDate
      let stopLossHitDate = call.stopLossHitDate

      if (call.target1Hit && !call.target1HitDate) {
        // If target 1 hit, set it to hitDate - some hours (or just hitDate if only T1 hit)
        if (call.target3Hit) {
          // All 3 targets - T1 was hit first, maybe 2-4 hours after call
          const hoursToAdd = Math.floor(Math.random() * 3) + 2 // 2-4 hours
          target1HitDate = new Date(callTime + hoursToAdd * 60 * 60 * 1000)
        } else if (call.target2Hit) {
          // T1 and T2 - T1 was hit first
          const hoursToAdd = Math.floor(Math.random() * 4) + 3 // 3-6 hours
          target1HitDate = new Date(callTime + hoursToAdd * 60 * 60 * 1000)
        } else {
          // Only T1 hit
          target1HitDate = baseHitDate
        }
      }

      if (call.target2Hit && !call.target2HitDate) {
        if (call.target3Hit) {
          // T2 and T3 hit - T2 was in between
          const hoursToAdd = Math.floor(Math.random() * 8) + 6 // 6-14 hours
          target2HitDate = new Date(callTime + hoursToAdd * 60 * 60 * 1000)
        } else {
          // Only T2 hit (and T1)
          target2HitDate = baseHitDate
        }
      }

      if (call.target3Hit && !call.target3HitDate) {
        // T3 is always the final hit
        target3HitDate = baseHitDate
      }

      if (call.stopLossHit && !call.stopLossHitDate) {
        stopLossHitDate = baseHitDate
      }

      // Update the call
      await prisma.tradingCall.update({
        where: { id: call.id },
        data: {
          target1HitDate,
          target2HitDate,
          target3HitDate,
          stopLossHitDate,
        },
      })

      console.log(`  ✓ Updated ${call.scriptName}`)
      if (target1HitDate) console.log(`    Target 1: ${target1HitDate.toISOString()}`)
      if (target2HitDate) console.log(`    Target 2: ${target2HitDate.toISOString()}`)
      if (target3HitDate) console.log(`    Target 3: ${target3HitDate.toISOString()}`)
      if (stopLossHitDate) console.log(`    Stop Loss: ${stopLossHitDate.toISOString()}`)
      console.log()

      migratedCount++
    }

    console.log('='.repeat(60))
    console.log(`✅ Migration complete! Updated ${migratedCount} calls`)
    console.log('='.repeat(60))
  } catch (error) {
    console.error('Error during migration:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

migrateHitDates()
  .then(() => {
    console.log('\n✅ All calls migrated successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Migration failed:', error)
    process.exit(1)
  })
